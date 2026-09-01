from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.vacancy import Vacancy
from app.models.application import Application
from app.models.user import User
from app.schema.vacancy import VacancyCreate, VacancyOut
from app.core.deps import get_current_user, require_role

router = APIRouter(prefix="/vacancies", tags=["vacancies"])

@router.post("", response_model=VacancyOut)
def create_vacancy(
    payload: VacancyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hire")),
):
    vacancy = Vacancy(**payload.dict(), hirer_id=current_user.id)
    db.add(vacancy)
    db.commit()
    db.refresh(vacancy)
    return VacancyOut(**vacancy.__dict__, applicant_count=0)

@router.get("", response_model=list[VacancyOut])
def list_vacancies(db: Session = Depends(get_db)):
    """Public feed — used by the Work dashboard to show all open vacancies."""
    vacancies = db.query(Vacancy).filter(Vacancy.status == "open").order_by(Vacancy.created_at.desc()).all()
    result = []
    for v in vacancies:
        count = db.query(func.count(Application.id)).filter(Application.vacancy_id == v.id).scalar()
        result.append(VacancyOut(**v.__dict__, applicant_count=count))
    return result

@router.get("/mine", response_model=list[VacancyOut])
def my_vacancies(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hire")),
):
    """Used by the Hire dashboard — only this hirer's own posted jobs, with applicant counts."""
    vacancies = db.query(Vacancy).filter(Vacancy.hirer_id == current_user.id).order_by(Vacancy.created_at.desc()).all()
    result = []
    for v in vacancies:
        count = db.query(func.count(Application.id)).filter(Application.vacancy_id == v.id).scalar()
        result.append(VacancyOut(**v.__dict__, applicant_count=count))
    return result

@router.get("/{vacancy_id}", response_model=VacancyOut)
def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    v = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    count = db.query(func.count(Application.id)).filter(Application.vacancy_id == v.id).scalar()
    return VacancyOut(**v.__dict__, applicant_count=count)