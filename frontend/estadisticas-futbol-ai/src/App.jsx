import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

function App() {

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [shotsA, setShotsA] = useState("");
  const [shotsB, setShotsB] = useState("");
  const [posA, setPosA] = useState("");
  const [posB, setPosB] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const possessionData = [
    { name: teamA || "Equipo A", value: Number(posA) || 0 },
    { name: teamB || "Equipo B", value: Number(posB) || 0 }
  ];
  const shotsData = [
    {
      team: teamA || "Equipo A",
      shots: Number(shotsA) || 0
    },
    {
      team: teamB || "Equipo B",
      shots: Number(shotsB) || 0
    }
  ];

  async function analyze() {

    try {

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

    } catch (error) {

      setAnalysis("Error analizando partido");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>

      <h1>⚽ IA analizadora de partidos de fútbol </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

        <input placeholder="Equipo A" onChange={(e) => setTeamA(e.target.value)} />
        <input placeholder="Equipo B" onChange={(e) => setTeamB(e.target.value)} />

        <input placeholder="Remates Equipo A" onChange={(e) => setShotsA(e.target.value)} />
        <input placeholder="Remates Equipo B" onChange={(e) => setShotsB(e.target.value)} />

        <input placeholder="Posesión Equipo A %" onChange={(e) => setPosA(e.target.value)} />
        <input placeholder="Posesión Equipo B %" onChange={(e) => setPosB(e.target.value)} />

      </div>

      <br />

      <button onClick={analyze}>
        Analizar Partido
      </button>

      {loading && <p>⏳ Analizando partido...</p>}

      {analysis && (
        <div style={{ marginTop: 30 }}>

          <h2>📊 Análisis del Partido</h2>

          <p>
            <strong>⚽ Equipo dominante:</strong> {analysis.dominant_team}
          </p>

          <p>
            <strong>🧠 Estilo táctico:</strong> {analysis.tactical_style}
          </p>

          <p>
            <strong>📋 Resumen:</strong>
          </p>

          <p>{analysis.summary}</p>

        </div>
      )}

      {analysis && (
        <>
          <h2 style={{ marginTop: 30 }}>📊 Posesión</h2>

          <PieChart width={400} height={300}>
            <Pie
              data={possessionData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              <Cell fill="#3b82f6" />
              <Cell fill="#ef4444" />
            </Pie>

            <Tooltip />

          </PieChart>
        </>
      )}

      {analysis && (
        <>
          <h2 style={{ marginTop: 30 }}>📊 Remates</h2>

          <BarChart width={400} height={300} data={shotsData}>
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="shots" fill="#22c55e" />
          </BarChart>
        </>
      )}

    </div>
  );
}

export default App;