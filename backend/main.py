from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import json
import google.generativeai as genai
from database import engine, SessionLocal
import models

models.Base.metadata.create_all(bind=engine)

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-flash-lite-latest")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MatchStats(BaseModel):
    teamA: str
    teamB: str
    possessionA: int
    possessionB: int
    shotsA: int
    shotsB: int
    formationA: str
    formationB: str
    yellowA: int
    yellowB: int
    redA: int
    redB: int


@app.post("/analyze")
async def analyze_match(stats: MatchStats):

    prompt = f"""
Eres un analista táctico de fútbol.

Analiza el partido usando estas estadísticas:

Equipo A: {stats.teamA}
Equipo B: {stats.teamB}

Remates:
{stats.teamA}: {stats.shotsA}
{stats.teamB}: {stats.shotsB}

Posesión:
{stats.teamA}: {stats.possessionA}%
{stats.teamB}: {stats.possessionB}%

Formaciones:
{stats.teamA}: {stats.formationA}
{stats.teamB}: {stats.formationB}

Tarjetas Amarillas:
{stats.teamA}: {stats.yellowA}
{stats.teamB}: {stats.yellowB}

Tarjetas Rojas:
{stats.teamA}: {stats.redA}
{stats.teamB}: {stats.redB}

Evalúa:

- ritmo del partido
- intensidad de presión
- velocidad de transición
- fortalezas tácticas
- debilidades tácticas
- recomendaciones para el entrenador

Las fortalezas, debilidades y recomendaciones deben ser listas
de máximo 3 puntos cada una.


Responde SOLO en JSON válido.

Formato:

{{
 "dominant_team": "",
 "tactical_style": "",
 "intensity": "",
 "discipline": "",
 "formation_analysis": "",
 "key_insight": "",
 "summary": "",
  "tactical_recommendations": {{
   "teamA": [],
   "teamB": []
 }},
 "metrics": {{
   "attack": 0,
   "defense": 0,
   "control": 0,
   "discipline": 0
 }}
}}
"""

    response = model.generate_content(prompt)

    analysis_text = response.text
    analysis_text = analysis_text.replace("```json", "").replace("```", "").strip()

    try:
        analysis_json = json.loads(analysis_text)
    except:
        analysis_json = {
 "dominant_team": "unknown",
        "tactical_style": "unknown",
        "intensity": "unknown",
        "discipline": "unknown",
        "formation_analysis": "",
        "key_insight": "",
        "summary": "",
        "tactical_recommendations": {
            "teamA": [],
            "teamB": []
        },
        "metrics": {
            "attack": 0,
            "defense": 0,
            "control": 0,
            "discipline": 0
 }
}

    # Guardar en DB
    db = SessionLocal()

    match = models.Match(
        teamA=stats.teamA,
        teamB=stats.teamB,
        shotsA=stats.shotsA,
        shotsB=stats.shotsB,
        possessionA=stats.possessionA,
        possessionB=stats.possessionB,
        formationA=stats.formationA,
        formationB=stats.formationB,
        analysis=json.dumps(analysis_json)
    )

    db.add(match)
    db.commit()
    db.close()

    return {
        "analysis": analysis_json,
        "stats": stats
    }

@app.get("/matches")
def get_matches():

    db = SessionLocal()

    matches = db.query(models.Match).all()

    db.close()

    return matches