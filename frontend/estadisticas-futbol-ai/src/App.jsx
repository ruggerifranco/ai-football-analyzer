import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Cell, Pie, Tooltip, Bar, BarChart, XAxis, YAxis } from "recharts";

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
  const [matches, setMatches] = useState([]);
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
  const data = [
    { name: teamA, value: Number(shotsA) },
    { name: teamB, value: Number(shotsB) }
  ];
  const radarData = analysis?.metrics
    ? [
      { subject: "Ataque", value: analysis.metrics.attack },
      { subject: "Defensa", value: analysis.metrics.defense },
      { subject: "Control", value: analysis.metrics.control },
      { subject: "Disciplina", value: analysis.metrics.discipline }
    ]
    : [];

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
      loadMatches();

    } catch (error) {

      setAnalysis("Error analizando partido");

    } finally {

      setLoading(false);

    }
  }

  async function loadMatches() {

    try {

      const res = await fetch("http://127.0.0.1:8000/matches");
      const data = await res.json();

      setMatches(data);

    } catch (error) {

      console.error("Error cargando historial", error);

    }

  }

  function viewMatch(match) {

    const parsedAnalysis = JSON.parse(match.analysis);

    setTeamA(match.teamA);
    setTeamB(match.teamB);

    setShotsA(match.shotsA);
    setShotsB(match.shotsB);

    setPosA(match.possessionA);
    setPosB(match.possessionB);

    setAnalysis(parsedAnalysis);

  }

  useEffect(() => {

    loadMatches();

  }, []);

  return (
    <div style={{ padding: 40, margin: "0 auto" }}>

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
          {loading ? '⏳ Analizando partido...' : 'Analizar Partido'}
        </button>
      </div>


      {analysis &&
        (
          <div style={{
            margin: "0 auto"
          }}>
            <div>
              <h2>📊 Análisis táctico</h2>
              <p><strong>⚽ Equipo dominante:</strong> {analysis.dominant_team}</p>
              <p><strong>📐 Formaciones:</strong></p>
              <p>{analysis.formation_analysis}</p>
              <p>{analysis.discipline}</p>
              <p><strong>💡 Conclusión:</strong></p>
              <p>{analysis.key_insight}</p>
              <p>{analysis.summary}</p>
              <div style={{ marginTop: 30 }}>

                <h2>📈 Evaluación del partido</h2>

                <p>
                  <strong>🧠 Estilo táctico:</strong> {analysis.tactical_style}
                </p>

                <p>
                  <strong>🔥 Intensidad:</strong> {analysis.intensity}
                </p>

                <p>
                  <strong>🟨 Disciplina:</strong> {analysis.discipline}
                </p>

              </div>
            </div>
          </div>
        )
      }

      {analysis?.tactical_recommendations && (
        <div style={{ marginTop: 50 }}>

          <h2>🧠 Recomendaciones tácticas IA</h2>

          <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>

            <div>
              <h3>{teamA}</h3>
              <ul>
                {analysis.tactical_recommendations?.teamA?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>{teamB}</h3>
              <ul>
                {analysis.tactical_recommendations?.teamB?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {analysis && (
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "center"
          }}
        >

          <div>
            <h2>📊 Posesión</h2>
            <PieChart width={350} height={250}>
              <Pie
                data={possessionData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div>
            <h2>🎯 Remates</h2>
            <BarChart width={350} height={250} data={shotsData}>
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="shots" fill="#22c55e" />
            </BarChart>
          </div>

          {analysis?.metrics && (
            <div>
              <h2>📡 Radar táctico</h2>
              <RadarChart width={350} height={250} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 10]} />
                <Radar
                  name="Equipo"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </div>
          )}

        </div>
      )}

      <div style={{ marginTop: 60 }}>

        <h2 style={{ textAlign: "center" }}>
          📚 Historial de Partidos Analizados
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
          gap: 20,
          marginTop: 30
        }}>

          {matches.slice(0, 10).map((match) => {

            const analysis = JSON.parse(match.analysis);

            return (
              <div
                key={match.id}
                onClick={() => viewMatch(match)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 20,
                  background: "#9b9b9b",
                  cursor: "pointer",
                  transition: "0.2s",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
              >

                <h3>
                  ⚽ {match.teamA} vs {match.teamB}
                </h3>

                <p>
                  📅 {new Date(match.created_at).toLocaleString()}
                </p>

                <p>
                  📐 {match.formationA} vs {match.formationB}
                </p>

                <p>
                  🎯 Remates: {match.shotsA} - {match.shotsB}
                </p>

                <p>
                  📊 Posesión: {match.possessionA}% - {match.possessionB}%
                </p>

                <p>
                  🧠 Dominante: {analysis.dominant_team}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </div>
  );
}

export default App;