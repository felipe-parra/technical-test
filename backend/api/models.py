from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from .database import Base


class TaskModel(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False, unique=True)
    description = Column(String(1000), nullable=False)
    done = Column(Boolean, nullable=False, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))


class UserModel(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
