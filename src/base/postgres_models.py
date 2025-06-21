from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import CITEXT

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(CITEXT, unique=True, nullable=False)
    email = Column(CITEXT, unique=True, nullable=False)
    password = Column(String(255), nullable=False)
