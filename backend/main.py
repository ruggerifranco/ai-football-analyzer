from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

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

Analiza este partido:

Equipo A: {stats.teamA}
Equipo B: {stats.teamB}

Remates:
{stats.teamA}: {stats.shotsA}
{stats.teamB}: {stats.shotsB}

Posesión:
{stats.teamA}: {stats.possessionA}%
{stats.teamB}: {stats.possessionB}%

Devuelve SOLO un JSON con este formato:

{{
 "dominant_team": "",
 "tactical_style": "",
 "summary": ""
}}
"""

    response = model.generate_content(prompt)

    return {
    "analysis": response.text
}