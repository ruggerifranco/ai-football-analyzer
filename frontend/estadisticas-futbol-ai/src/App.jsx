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
  const [formationA, setFormationA] = useState("")
  const [formationB, setFormationB] = useState("")
  const [yellowA, setYellowA] = useState("")
  const [yellowB, setYellowB] = useState("")
  const [redA, setRedA] = useState("")
  const [redB, setRedB] = useState("")
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
          possessionB: Number(posB),
          formationA,
          formationB,
          yellowA: Number(yellowA),
          yellowB: Number(yellowB),
          redA: Number(redA),
          redB: Number(redB)
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
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>

      <h1 style={{ textAlign: "center", marginBottom: 40 }}>
        ⚽ IA Analizadora de Partidos de Fútbol
      </h1>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 400,
        margin: "0 auto"
      }}>
        <input placeholder="Equipo A" onChange={(e) => setTeamA(e.target.value)} />
        <input placeholder="Equipo B" onChange={(e) => setTeamB(e.target.value)} />

        <input placeholder="Remates Equipo A" onChange={(e) => setShotsA(e.target.value)} />
        <input placeholder="Remates Equipo B" onChange={(e) => setShotsB(e.target.value)} />

        <input placeholder="Posesión Equipo A %" onChange={(e) => setPosA(e.target.value)} />
        <input placeholder="Posesión Equipo B %" onChange={(e) => setPosB(e.target.value)} />

        <input placeholder="Formación Equipo A (ej 4-4-2)" onChange={(e) => setFormationA(e.target.value)} />
        <input placeholder="Formación Equipo B (ej 5-3-2)" onChange={(e) => setFormationB(e.target.value)} />

        <input placeholder="Amarillas Equipo A" onChange={(e) => setYellowA(e.target.value)} />
        <input placeholder="Amarillas Equipo B" onChange={(e) => setYellowB(e.target.value)} />

        <input placeholder="Rojas Equipo A" onChange={(e) => setRedA(e.target.value)} />
        <input placeholder="Rojas Equipo B" onChange={(e) => setRedB(e.target.value)} />

      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={analyze}>
          Analizar Partido
        </button>
      </div>

      {loading && <p>⏳ Analizando partido...</p>}

      {analysis && (
        <div style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40
        }}>
          <div>

            <h2>📊 Análisis táctico</h2>

            <p><strong>⚽ Equipo dominante:</strong> {analysis.dominant_team}</p>
            <p><strong>🧠 Estilo táctico:</strong> {analysis.tactical_style}</p>
            <p><strong>🔥 Intensidad:</strong> {analysis.intensity}</p>

            <p><strong>📐 Formaciones:</strong></p>
            <p>{analysis.formation_analysis}</p>

            <p><strong>🟨 Disciplina:</strong></p>
            <p>{analysis.discipline}</p>

            <p><strong>💡 Insight:</strong></p>
            <p>{analysis.key_insight}</p>

            <p>{analysis.summary}</p>

          </div>

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