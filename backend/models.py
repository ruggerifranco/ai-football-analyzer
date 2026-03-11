from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime


class Match(Base):

    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)

    teamA = Column(String)
    teamB = Column(String)

    shotsA = Column(Integer)
    shotsB = Column(Integer)

    possessionA = Column(Integer)
    possessionB = Column(Integer)

    formationA = Column(String)
    formationB = Column(String)

    analysis = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)