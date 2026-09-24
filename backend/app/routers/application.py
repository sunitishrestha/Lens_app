from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import get_current_user, require_role
from app.models.application import Application
from app.models.vacancy import Vacancy
from app.models.user import User
from app.schema.application import (
    ApplicantOut,
    ApplicationCreate,
    ApplicationOut,
    ApplicationStatusUpdate,
)

router = APIRouter(tags=["applications"])


@router.post("/applications", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("work")),
):
    vacancy = db.query(Vacancy).filter(Vacancy.id == payload.vacancy_id).first()
    if not vacancy or vacancy.status != "open":
        raise HTTPException(status_code=404, detail="Open vacancy not found")

    existing = (
        db.query(Application)
        .filter(
            Application.vacancy_id == payload.vacancy_id,
            Application.applicant_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="You already applied to this vacancy")

    application = Application(**payload.dict(), applicant_id=current_user.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/applications/me", response_model=list[ApplicationOut])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("work")),
):
    return (
        db.query(Application)
        .filter(Application.applicant_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )


@router.get("/applications/vacancy/{vacancy_id}", response_model=list[ApplicantOut])
def get_vacancy_applicants(
    vacancy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("hire")),
):
    vacancy = db.query(Vacancy).filter(Vacancy.id == vacancy_id).first()
    if not vacancy or vacancy.hirer_id != current_user.id:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    rows = (
        db.query(Application, User)
        .join(User, User.id == Application.applicant_id)
        .filter(Application.vacancy_id == vacancy_id)
        .order_by(Application.applied_at.desc())
        .all()
    )
    return [
        ApplicantOut(
            application_id=application.id,
            status=application.status,
            applied_at=application.applied_at,
            applicant_id=application.applicant_id,
            full_name=applicant.full_name,
            email=applicant.email,
            portfolio_link=application.portfolio_link,
            message=application.message,
            equipment=application.equipment,
        )
        for application, applicant in rows
    ]


@router.patch("/applications/{application_id}/status", response_model=ApplicationOut)
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
    if not vacancy or vacancy.hirer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to update this application")

    application.status = payload.status
    db.commit()
    db.refresh(application)
    return application


@router.get("/applications")
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all applications for the current user"""
    return {"message": "Get applications endpoint"}
