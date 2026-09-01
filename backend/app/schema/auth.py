from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

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
    bio: Optional[str] = None
    skills: Optional[list[str]] = []
    avatar_url: Optional[str] = None


    class Config:
        from_attributes = True  # allows returning SQLAlchemy model directly

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[list[str]] = None
    avatar_url: Optional[str] = None
    
class AuthResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserOut