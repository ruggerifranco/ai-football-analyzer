from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import json
import google.generativeai as genai

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

Responde SOLO en JSON válido.

Formato:

{{
 "dominant_team": "",
 "tactical_style": "",
 "intensity": "",
 "discipline": "",
 "formation_analysis": "",
 "key_insight": "",
 "summary": ""
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
         "formation_analysis": "unknown",
         "key_insight": analysis_text,
         "summary": analysis_text
    }

    return {
    "analysis": analysis_json,
    "stats": stats
}