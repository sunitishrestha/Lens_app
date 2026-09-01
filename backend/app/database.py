from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
import os
from dotenv import load_dotenv

load_dotenv()

# Synchronous database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://joblens:joblens_dev_password@db:5432/joblens")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
