from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.vacancies import router as vacancies_router
from app.routers.applications import router as applications_router


settings = get_settings()
app = FastAPI(title="JobLens API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_credentials=False, allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router, prefix="/api/v1")
app.include_router(vacancies_router, prefix="/api/v1")
app.include_router(applications_router, prefix="/api/v1")
