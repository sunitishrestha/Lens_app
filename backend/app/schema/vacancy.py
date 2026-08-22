from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class VacancyCreate(BaseModel):
    title: str
    category: str
    description: str
    location: str
    price: str

class VacancyOut(BaseModel):
    id: int
    hirer_id: int
    title: str
    category: str
    description: str
    location: str
    price: str
    status: str
    created_at: datetime
    applicant_count: int = 0   # filled in manually in the router

    class Config:
        from_attributes = True