from typing import Optional
from pydantic import BaseModel, EmailStr


class TaskBase(BaseModel):
    id: Optional[int]
    title: Optional[str]
    description: Optional[str]
    done: Optional[bool] = False
    user_id: Optional[int]

    class Config:
        schema_extra = {
            "example": {
                "title": "Task title",
                "description": "Task description",
                "done": False
            }
        }


class UserRegister(BaseModel):
    id: Optional[int]
    name: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@yopmail.com",
                "password": "password"
            }
        }


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "john@yopmail.com",
                "password": "password"
            }
        }


class TokenResponse(BaseModel):
    access_token: str
