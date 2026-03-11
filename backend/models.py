from sqlalchemy import Column, Integer, String, Text
from database import Base

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