from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.vacancy import router as vacancy_router
from app.routers.application import router as application_router


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
app.include_router(vacancy_router, prefix="/api/v1")
app.include_router(application_router, prefix="/api/v1")
