from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class ApplicationCreate(BaseModel):
    vacancy_id: int

class ApplicationOut(BaseModel):
    id: int
    vacancy_id: int
    applicant_id: int
    status: str
    applied_at: datetime

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