from pydantic import BaseModel, EmailStr
from typing import Literal

class RegisterPayload(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Literal["hire", "work"]

class LoginPayload(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: Literal["hire", "work"]

    class Config:
        from_attributes = True  # allows returning SQLAlchemy model directly

class AuthResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserOut