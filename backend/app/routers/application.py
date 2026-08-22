from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.application import Application
from app.models.vacancy import Vacancy
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate, ApplicantOut
from app.core.deps import get_current_user, require_role

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("", response_model=ApplicationOut)
def apply_to_vacancy(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("work")),
):
    vacancy = db.query(Vacancy).filter(Vacancy.id == payload.vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    existing = db.query(Application).filter(
        Application.vacancy_id == payload.vacancy_id,
        Application.applicant_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already applied to this vacancy")

    application = Application(vacancy_id=payload.vacancy_id, applicant_id=current_user.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/me", response_model=list[ApplicationOut])
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("work")),
):
    return db.query(Application).filter(Application.applicant_id == current_user.id).all()

@router.get("/vacancy/{vacancy_id}", response_model=list[ApplicantOut])
def applicants_for_vacancy(
    vacancy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hire")),
):
    """Hirer views everyone who applied to one of their vacancies."""
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy or vacancy.hirer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your vacancy")

    rows = (
        db.query(Application, User)
        .join(User, Application.applicant_id == User.id)
        .filter(Application.vacancy_id == vacancy_id)
        .all()
    )
    return [
        ApplicantOut(
            application_id=app.id,
            status=app.status,
            applied_at=app.applied_at,
            applicant_id=user.id,
            full_name=user.full_name,
            email=user.email,
        )
        for app, user in rows
    ]

@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hire")),
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    vacancy = db.query(Vacancy).filter(Vacancy.id == application.vacancy_id).first()
    if vacancy.hirer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your vacancy")

    application.status = payload.status
    db.commit()
    db.refresh(application)
    return application