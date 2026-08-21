from sqlalchemy import Column, Integer, String, Enum
from app.db.base import Base
import enum

class RoleEnum(str, enum.Enum):
    hire = "hire"
    work = "work"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)