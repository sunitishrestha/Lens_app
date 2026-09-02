from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter(tags=["applications"])


@router.get("/applications")
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all applications for the current user"""
    return {"message": "Get applications endpoint"}
