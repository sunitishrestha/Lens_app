from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schema.auth import RegisterPayload, LoginPayload, AuthResponse, UserOut, ProfileUpdate
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_current_user
from fastapi import UploadFile, File
import os
import shutil
import uuid


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token(user.id)
    return AuthResponse(access_token=token, user=user)

@router.patch("/me", response_model=UserOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/me/avatar", response_model=UserOut)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        # Validate file was provided
        if not file or not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Validate extension
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Only {', '.join(ALLOWED_EXTENSIONS)} images are allowed"
            )

        # Read and validate file size
        contents = file.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"Image must be under {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        file.file.seek(0)

        # Save the file
        os.makedirs("uploads/avatars", exist_ok=True)
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = f"uploads/avatars/{filename}"

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Delete the old avatar file if one exists, to avoid orphaned files piling up
        if current_user.avatar_url:
            old_path = current_user.avatar_url.lstrip("/")
            try:
                if os.path.exists(old_path):
                    os.remove(old_path)
            except Exception as e:
                # Log but don't fail if we can't delete old file
                print(f"Warning: Could not delete old avatar: {e}")

        # Update user with new avatar URL
        current_user.avatar_url = f"/uploads/avatars/{filename}"
        db.commit()
        db.refresh(current_user)
        return current_user
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"File upload failed: {str(e)}"
        )