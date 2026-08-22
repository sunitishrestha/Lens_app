from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Vacancy(Base):
    __tablename__ = "vacancies"

    id = Column(Integer, primary_key=True, index=True)
    hirer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)          # e.g. WEDDING, COMMERCIAL
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    price = Column(String, nullable=False)               # keep simple as string like "$1,200"
    status = Column(String, default="open")               # open / closed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("Application", back_populates="vacancy")