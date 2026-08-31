from pydantic import BaseModel
from datetime import datetime
from typing import Literal, Optional

class ApplicationCreate(BaseModel):
    vacancy_id: int
    portfolio_link: Optional[str] = None
    message: Optional[str] = None
    confirmed_availability: bool = False
    equipment: Optional[list[str]] = []


class ApplicationOut(BaseModel):
    id: int
    vacancy_id: int
    applicant_id: int
    status: str
    applied_at: datetime
    portfolio_link: Optional[str] = None
    message: Optional[str] = None
    confirmed_availability: bool = False
    equipment: Optional[list[str]] = []

    class Config:
        from_attributes = True

class ApplicationStatusUpdate(BaseModel):
    status: Literal["applied", "shortlisted", "hired", "rejected"]

class ApplicantOut(BaseModel):
    """Used by hirer to see who applied, with the applicant's user info attached."""
    application_id: int
    status: str
    applied_at: datetime
    applicant_id: int
    full_name: str
    email: str
    portfolio_link: Optional[str] = None
    message: Optional[str] = None
    equipment: Optional[list[str]] = []