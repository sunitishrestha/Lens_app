from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    vacancy_id = Column(Integer, ForeignKey("vacancies.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="applied")  # applied / shortlisted / hired / rejected
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    vacancy = relationship("Vacancy", back_populates="applications")

    __table_args__ = (
        UniqueConstraint("vacancy_id", "applicant_id", name="uq_vacancy_applicant"),
    )