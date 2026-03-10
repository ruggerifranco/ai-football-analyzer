from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import google.generativeai as genai

genai.configure(api_key="AIzaSyAFAStM3GPnv-wP-bMRXM5t40t0aGFkvpY")

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

Responde SOLO en JSON válido.

Formato:

{{
 "dominant_team": "",
 "tactical_style": "",
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
        "summary": analysis_text
    }

    return {
    "analysis": analysis_json,
    "stats": stats
}