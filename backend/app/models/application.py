from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    vacancy_id = Column(Integer, ForeignKey("vacancies.id", ondelete="CASCADE"), nullable=False)   
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="applied")  # applied / shortlisted / hired / rejected
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    portfolio_link = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    confirmed_availability = Column(Boolean, default=False)
    equipment = Column(ARRAY(String), nullable=True, default=[])

    vacancy = relationship("Vacancy", back_populates="applications")

    __table_args__ = (
        UniqueConstraint("vacancy_id", "applicant_id", name="uq_vacancy_applicant"),
    )