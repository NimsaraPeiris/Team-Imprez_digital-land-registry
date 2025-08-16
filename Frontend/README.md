# Frontend README

This README documents the Frontend service only.

## Development with Docker Compose

From repository root run:

```pwsh
docker-compose up --build
```

The frontend dev server will be available at http://localhost:3000 and is configured in the compose file to wait until the backend healthcheck passes.

### Environment variables

- For production builds set `NEXT_PUBLIC_API_BASE` to the full URL of the backend API (for example `https://api.example.com`).

### Running inside container

To run frontend commands inside the container:

```pwsh
docker-compose run --rm frontend pwsh -c "corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm dev --host 0.0.0.0"
```
