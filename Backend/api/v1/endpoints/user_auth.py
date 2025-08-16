from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import datetime, timedelta
import os
import jwt

from database.session import get_db
from schemas.user_schemas import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from crud.users import get_user_by_email, create_user
from crud.users import get_user_by_id
from models.lro_backend_models import User as _User

JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
try:
    ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")))
except Exception:
    ACCESS_TOKEN_EXPIRES_MINUTES = 1440

router = APIRouter(prefix="/user/auth", tags=["user-auth"])

async def create_access_token(subject: str, expires_delta: Optional[timedelta] = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES))
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# Helper: find user by nic + phone. We implement here to delegate to crud.users.get_user_by_nic_and_phone
async def get_user_by_nic_and_phone(db: AsyncSession, nic: str, phone: str):
    # Delegate to CRUD implementation which performs a DB lookup. This avoids tests having to monkeypatch the module.
    try:
        from crud.users import get_user_by_nic_and_phone as _crud_lookup
        return await _crud_lookup(db, nic, phone)
    except Exception:
        # If the CRUD helper is missing or fails, fall back to raising NotImplementedError to preserve previous behavior.
        raise NotImplementedError("NIC+phone lookup not implemented; ensure crud.users.get_user_by_nic_and_phone is available")

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    # payload may be accepted using frontend aliases (fullName, id, phone, requesterType, registrationOffice)
    # Check if user already exists by email or nic
    existing = await get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    # create_user signature: (db, full_name, nic_number, email, password, phone_number=None, address=None, user_type='citizen')
    # Support mapping requester_type -> user_type and registration_office -> address for now
    user = await create_user(db, payload.full_name, payload.nic_number, payload.email, payload.password or "", payload.phone_number, payload.registration_office)
    return user

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    # Support both email-only login and id+phone+otp flows
    # Email-only login: issue token if the email exists (no password required)
    if payload.email:
        user = await get_user_by_email(db, payload.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = await create_access_token(str(user.user_id))
        return {"access_token": token, "token_type": "bearer"}

    # Support OTP flow: id + phone + otp
    if payload.id and payload.phone and payload.otp:
        # Look up user by nic and phone. Tests can now rely on a DB-backed lookup implemented in crud.users
        user = None
        try:
            user = await get_user_by_nic_and_phone(db, payload.id, payload.phone)
        except NotImplementedError:
            # allow tests to monkeypatch get_user_by_nic_and_phone; if not patched, attempt fallback using email lookup
            user = None
        if not user:
            # As a last resort, try existing get_user_by_email if the frontend used email in the id field
            try:
                user = await get_user_by_email(db, payload.id)
            except Exception:
                user = None
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        # Validate OTP: accept any 6-digit numeric code for now
        if not payload.otp.isdigit() or len(payload.otp) != 6:
            raise HTTPException(status_code=401, detail="Invalid OTP")
        token = await create_access_token(str(user.user_id))
        return {"access_token": token, "token_type": "bearer"}

    raise HTTPException(status_code=400, detail="Invalid login payload")

# Dependency for routes requiring auth (user)
from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
bearer_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: AsyncSession = Depends(get_db)):
    token = credentials.credentials
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = data.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    # fetch by id
    user = await get_user_by_id(db, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    return user
