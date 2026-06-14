from sqlalchemy import Column, Integer, String 
from db.database import Base
from pydantic import BaseModel

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True,index=True)
    email = Column(String, unique=True)
    password = Column(String)

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str