import { useState } from "react";

function App() {

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [shotsA, setShotsA] = useState("");
  const [shotsB, setShotsB] = useState("");
  const [posA, setPosA] = useState("");
  const [posB, setPosB] = useState("");

  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {

    setLoading(true);
    setAnalysis("");

    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teamA,
        teamB,
        shotsA: Number(shotsA),
        shotsB: Number(shotsB),
        possessionA: Number(posA),
        possessionB: Number(posB)
      })
    });

    const data = await res.json();

    setAnalysis(data.analysis);
    setLoading(false);
  }

  return (
    <div style={{padding:40, maxWidth:600}}>

      <h1>⚽ AI Football Match Analyzer</h1>

      <input placeholder="Equipo A" onChange={(e)=>setTeamA(e.target.value)} />
      <input placeholder="Equipo B" onChange={(e)=>setTeamB(e.target.value)} />

      <input placeholder="Remates Equipo A" onChange={(e)=>setShotsA(e.target.value)} />
      <input placeholder="Remates Equipo B" onChange={(e)=>setShotsB(e.target.value)} />

      <input placeholder="Posesión Equipo A %" onChange={(e)=>setPosA(e.target.value)} />
      <input placeholder="Posesión Equipo B %" onChange={(e)=>setPosB(e.target.value)} />

      <br/><br/>

      <button onClick={analyze}>
        Analizar Partido
      </button>

      {loading && <p>⏳ Analizando partido...</p>}

      <pre>{analysis}</pre>

    </div>
  );
}

export default App;