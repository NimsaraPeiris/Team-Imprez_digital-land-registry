// Determine API base: prefer build-time NEXT_PUBLIC var if available, otherwise use relative '/api'
export const API_BASE = (globalThis as any)?.NEXT_PUBLIC_API_BASE_URL || "/api"

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return null
    const obj = JSON.parse(raw)
    return obj?.token || null
  } catch (e) {
    return null
  }
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const token = getAuthToken()
  const headers = new Headers(init.headers as HeadersInit || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const merged: RequestInit = { ...init, headers }
  return fetch(url, merged)
}

export async function apiPostJson(path: string, body: any) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function apiPostForm(path: string, formData: FormData) {
  return apiFetch(path, {
    method: 'POST',
    body: formData,
  })
}

// If backend returns internal static paths like '/internal/static/…', normalize to full URL
export function normalizeDownloadUrl(url: string) {
  if (!url) return url
  if (url.startsWith('http')) return url
  if (url.startsWith('/internal/static')) {
    // Prefix with API_BASE so '/internal/static/...' becomes '/api/internal/static/...' in client calls
    return `${API_BASE}${url}`
  }
  return url
}
