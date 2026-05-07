import React, { useState } from "react";

export default function HealthCheck() {
  const questions = [
    { q: "What's your primary symptom today?", type: "text", placeholder: "e.g. Fever" },
    { q: "How long have you been experiencing this?", type: "text", placeholder: "e.g. 4-7 days" },
    { q: "How would you rate your pain or discomfort?", type: "slider" },
    { q: "Have you noticed any fever?", type: "text", placeholder: "Yes or No" },
    { q: "Are you experiencing any breathing difficulties?", type: "text", placeholder: "Yes or No" },
    { q: "How has your energy level been?", type: "text", placeholder: "e.g. Quite tired" },
    { q: "Any changes in appetite or sleep?", type: "text", placeholder: "e.g. Poor sleep" },
    { q: "Have you been under unusual stress lately?", type: "text", placeholder: "Yes or No" },
    { q: "Any known allergies or chronic conditions?", type: "text", placeholder: "e.g. Asthma" },
    { q: "Have you taken any medication for this?", type: "text", placeholder: "e.g. Over-the-counter" },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);      
  const [pain, setPain] = useState(5);            
  const [report, setReport] = useState(null);      


  function saveAnswer(index, value) {
    const copy = answers.slice();
    copy[index] = { question: questions[index].q, answer: value };
    setAnswers(copy);
  }


  async function handleNext() {

    if (questions[step].type === "slider") {
      saveAnswer(step, `${pain}/10`);
    }
    const currentAnswer = answers[step] || (questions[step].type === "slider" ? { answer: `${pain}/10` } : null);
    if (!currentAnswer || !String(currentAnswer.answer || "").trim()) {

      alert("Please provide an answer before continuing.");
      return;
    }
    if (step === questions.length - 1) {
      await makeReport();
    } else {
      setStep(step + 1);
    }
  }

  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }


  function computeConfidence(payload) {
    let s = 50;
    const primary = (payload[0]?.answer || "").toLowerCase();
    if (primary.includes("fever") || primary.includes("cough")) s += 25;
    if ((payload[3]?.answer || "").toLowerCase().includes("yes")) s += 10;
    if ((payload[4]?.answer || "").toLowerCase().includes("yes")) s += 10;
    const p = parseInt((payload[2]?.answer || "0").split("/")[0], 10);
    if (!Number.isNaN(p) && p >= 7) s += 10;
    if (s > 95) s = 95;
    if (s < 10) s = 10;
    return Math.round(s);
  }


  async function callGroqIfAvailable(payload) {
    const key = typeof window !== "undefined" ? window.REACT_APP_GROQ_API_KEY : null;
    if (!key) return null;
    try {
      const res = await fetch("https://api.groq.ai/v1/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          inputs: [{ role: "user", content: { type: "text", text: `Questionnaire:\n${JSON.stringify(payload, null, 2)}\nReturn JSON: disease, causes (array), advice, prevention (array), confidence (0-100).` } }]
        })
      });
      if (!res.ok) return null;
      const data = await res.json();

      return data?.result || data?.outputs?.[0]?.content || data;
    } catch (e) {
      console.error("Groq call failed", e);
      return null;
    }
  }


  async function makeReport() {
    const payload = questions.map((q, i) => {
      const a = answers[i];
      if (a && a.answer) return { question: q.q, answer: a.answer };
      if (q.type === "slider" && i === 2) return { question: q.q, answer: `${pain}/10` };
      return { question: q.q, answer: null };
    });

    const ai = await callGroqIfAvailable(payload);


    let insights;
    if (ai) {
      insights = {
        disease: ai.disease || ai.title || "AI assessment",
        causes: ai.causes || ai.possible_causes || [],
        advice: ai.advice || ai.next_steps || "",
        prevention: ai.prevention || ai.measures || [],
      };
    } else {
      const primary = (payload[0].answer || "").toLowerCase();
      if (primary.includes("fever") || primary.includes("cough")) {
        insights = {
          disease: "Possible Viral/Bacterial Infection",
          causes: ["Viral or bacterial infection", "Respiratory irritation"],
          advice: "Rest, hydrate, monitor temperature. See doctor if worse.",
          prevention: ["Hydration", "Rest", "Hygiene"],
        };
      } else {
        insights = {
          disease: "General Symptom Assessment",
          causes: ["Non-specific / lifestyle causes"],
          advice: "Monitor and seek care if symptoms persist.",
          prevention: ["Rest", "Hydration"],
        };
      }
    }

    const confidence = ai && (ai.confidence || ai.score)
      ? Math.round((ai.confidence || ai.score) * (ai.confidence <= 1 ? 100 : 1))
      : computeConfidence(payload);

    const final = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      confidence,
      severity: confidence >= 70 ? "High Concern" : confidence >= 40 ? "Moderate Concern" : "Low Concern",
      primary: payload[0]?.answer || "",
      responses: payload,
      insights,
    };


    try {
      const arr = JSON.parse(localStorage.getItem("healthsense_reports") || "[]");
      arr.unshift(final);
      localStorage.setItem("healthsense_reports", JSON.stringify(arr));
    } catch (e) {
      console.error("save report failed", e);
    }

    setReport(final);
  }


  if (!report) {
    const cur = questions[step];
    return (
      <div style={{ maxWidth: 800, margin: "24px auto", padding: 20, background: "#fff", borderRadius: 8 }}>
        <h2 style={{ marginBottom: 12 }}>Health Check</h2>

        <label style={{ display: "block", marginBottom: 8 }}>{cur.q}</label>

        {cur.type === "slider" ? (
          <div>
            <input type="range" min="0" max="10" value={pain} onChange={(e) => setPain(Number(e.target.value))} />
            <div style={{ textAlign: "center", fontWeight: 600 }}>{pain}/10</div>
          </div>
        ) : (
          <input
            type="text"
            placeholder={cur.placeholder}
            value={answers[step]?.answer || ""}
            onChange={(e) => saveAnswer(step, e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
          />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button onClick={handlePrev} disabled={step === 0} style={{ padding: "8px 12px" }}>Prev</button>
          <button onClick={handleNext} style={{ padding: "8px 12px", background: "#000", color: "#fff" }}>
            {step === questions.length - 1 ? "Get Results" : "Continue"}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 20 }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, border: "2px solid #f87171", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
            {report.confidence}%
          </div>
          <div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>{report.severity}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(report.createdAt).toLocaleString()}</div>
            <div style={{ marginTop: 8 }}><strong>Primary:</strong> {report.primary || "—"}</div>
          </div>
        </div>

        <section style={{ background: "#f3f4f6", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          <h4 style={{ margin: "0 0 8px 0" }}>Your Responses</h4>
          {report.responses.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ color: "#374151" }}>{r.question}</div>
              <div style={{ background: "#fff", padding: "4px 8px", borderRadius: 999 }}>{r.answer || "—"}</div>
            </div>
          ))}
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 12 }}>
          <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 6 }}>
            <h5>Possible Causes</h5>
            <ul style={{ paddingLeft: 18 }}>
              {report.insights.causes && report.insights.causes.length ? report.insights.causes.map((c,i)=><li key={i}>{c}</li>) : <li>Not enough data</li>}
            </ul>
          </div>

          <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 6 }}>
            <h5>Next Steps</h5>
            <p>{report.insights.advice}</p>
          </div>

          <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 6 }}>
            <h5>Preventive Measures</h5>
            <ul style={{ paddingLeft: 18 }}>
              {report.insights.prevention && report.insights.prevention.length ? report.insights.prevention.map((p,i)=><li key={i}>{p}</li>) : <li>General precautions</li>}
            </ul>
          </div>
        </div>

        <div style={{ background: "#fff3f2", borderLeft: "4px solid #fecaca", padding: 12, borderRadius: 6 }}>
          <div style={{ color: "#374151" }}>Based on this assessment, we recommend consulting a healthcare professional.</div>
        </div>
      </div>
    </div>
  );
}