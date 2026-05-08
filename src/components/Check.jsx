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
      <div className="max-w-[800px] mx-4 md:mx-auto my-6 p-5 bg-white rounded-lg shadow-md dark:bg-[#1E293B] dark:text-gray-300">
        <h2 className="mb-3 text-2xl md:text-3xl font-serif font-light text-[#43664d] dark:text-gray-300">
          Health Check
        </h2>

        <label className="block mb-2 text-gray-700 font-medium dark:text-gray-300">
          {cur.q}
        </label>

        {cur.type === "slider" ? (
          <div>
            <input
              type="range"
              min="0"
              max="10"
              value={pain}
              onChange={(e) => setPain(Number(e.target.value))}
              className="w-full accent-[#43664d] dark:accent-gray-300"
            />
            <div className="text-center font-semibold text-[#43664d] mt-2 dark:text-gray-300">
              {pain}/10
            </div>
          </div>
        ) : (
          <input
            type="text"
            placeholder={cur.placeholder}
            value={answers[step]?.answer || ""}
            onChange={(e) => saveAnswer(step, e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 outline-none focus:border-[#43664d]"
          />
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#475569] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            Prev
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-[#43664d] text-white hover:bg-[#35513d] dark:bg-[#43664d] dark:text-white dark:hover:bg-[#35513d] hover:cursor-pointer"
          >
            {step === questions.length - 1 ? "Get Results" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-4 md:mx-auto my-6">
      <div className="bg-white p-4 md:p-5 rounded-lg shadow-md dark:bg-[#1E293B] dark:text-gray-300">
        
        <div className="flex items-center gap-4 mb-3">
          <div className="w-[72px] h-[72px] rounded-full border-2 border-red-300 flex items-center justify-center font-bold text-[#43664d] dark:text-gray-300">
            {report.confidence}%
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {report.severity}
            </div>

            <div className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(report.createdAt).toLocaleString()}
            </div>

            <div className="mt-2">
              <strong>Primary:</strong> {report.primary || "—"}
            </div>
          </div>
        </div>

        <section className="bg-gray-100 p-3 rounded-md mb-3 dark:bg-[#334155]">
          <h4 className="mb-2 font-semibold text-[#43664d] dark:text-gray-300">
            Your Responses
          </h4>

          {report.responses.map((r, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600"
            >
              <div className="text-gray-700 dark:text-gray-300">
                {r.question}
              </div>

              <div className="bg-white px-3 py-1 rounded-full text-sm shadow-sm dark:bg-[#334155]">
                {r.answer || "—"}
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          
          <div className="p-3 border border-gray-200 rounded-md dark:border-gray-600">
            <h5 className="font-semibold mb-2 text-[#43664d] dark:text-gray-300">
              Possible Causes
            </h5>

            <ul className="pl-5 list-disc">
              {report.insights.causes && report.insights.causes.length
                ? report.insights.causes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))
                : <li>Not enough data</li>}
            </ul>
          </div>

          <div className="p-3 border border-gray-200 rounded-md dark:border-gray-600">
            <h5 className="font-semibold mb-2 text-[#43664d] dark:text-gray-300">
              Next Steps
            </h5>

            <p>{report.insights.advice}</p>
          </div>

          <div className="p-3 border border-gray-200 rounded-md dark:border-gray-600">
            <h5 className="font-semibold mb-2 text-[#43664d] dark:text-gray-300">
              Preventive Measures
            </h5>

            <ul className="pl-5 list-disc">
              {report.insights.prevention && report.insights.prevention.length
                ? report.insights.prevention.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))
                : <li>General precautions</li>}
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-200 p-3 rounded-md dark:bg-[#334155] dark:border-red-700">
          <div className="text-gray-700 dark:text-gray-300">
            Based on this assessment, we recommend consulting a healthcare professional.
          </div>
        </div>

      </div>
    </div>
  );
}