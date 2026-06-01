import { useState } from "react";

const AI_API_BASE_URL = "http://127.0.0.1:5001";

export default function HealthCheck() {
  const [report, setReport] = useState(null);      
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  function getMockAIQuestion(previousAnswers) {
    const count = previousAnswers.length;
    if (count === 0) {
      return {
        id: "q_1",
        questionText: "What symptoms are you experiencing right now?",
        type: "multi_select",
        options: ["Fever", "Cough", "Headache", "Body pain", "Fatigue", "Breathing difficulty", "Stomach pain", "Other"],
        allowOther: true,
        required: true,
        helperText: "",
        isFinalQuestion: false
      };
    } else if (count === 1) {
      return {
        id: "q_2",
        questionText: "How long have you been experiencing these symptoms?",
        type: "single_select",
        options: ["Less than 24 hours", "1-2 days", "3-5 days", "More than a week", "More than a month", "Other"],
        allowOther: true,
        required: true,
        helperText: "",
        isFinalQuestion: false
      };
    } else if (count === 2) {
      return {
        id: "q_3",
        questionText: "How severe is your discomfort right now?",
        type: "scale",
        options: [],
        allowOther: false,
        required: true,
        helperText: "",
        isFinalQuestion: false
      };
    } else if (count === 3) {
      return {
        id: "q_4",
        questionText: "Do you also notice any of these warning signs?",
        type: "multi_select",
        options: ["Chest pain", "Breathing difficulty", "Dizziness or fainting", "Confusion", "Persistent vomiting", "Severe weakness", "None of these", "Other"],
        allowOther: true,
        required: true,
        helperText: "",
        isFinalQuestion: false
      };
    } else if (count === 4) {
      return {
        id: "q_5",
        questionText: "Have you taken any action or medication for this?",
        type: "multi_select",
        options: ["Rested", "Drank more fluids", "Took over-the-counter medicine", "Consulted a doctor", "No action yet", "Other"],
        allowOther: true,
        required: true,
        helperText: "",
        isFinalQuestion: false
      };
    } else {
      return { isFinalQuestion: true };
    }
  }

  function generateMockAIReport(aiAnswers) {
    const combinedStr = aiAnswers.map(a => String(a.answer).toLowerCase()).join(" ");
    
    let urgencyLevel = "Low";
    if (["chest pain", "breathing difficulty", "fainting", "confusion", "seizure", "severe weakness"].some(k => combinedStr.includes(k))) {
      urgencyLevel = "Urgent";
    } else if (["fever", "persistent vomiting", "more than a week", "severe", "8", "9", "10"].some(k => combinedStr.includes(k))) {
      urgencyLevel = "High";
    } else if (["cough", "headache", "body pain", "fatigue", "stomach pain", "5", "6", "7"].some(k => combinedStr.includes(k))) {
      urgencyLevel = "Moderate";
    }

    let confidenceScore = 55;
    if (aiAnswers.length >= 5) confidenceScore += 10;
    if (aiAnswers.some(a => a.question.includes("How long"))) confidenceScore += 10;
    if (aiAnswers.some(a => a.question.includes("severe"))) confidenceScore += 10;
    if (aiAnswers.some(a => a.question.includes("action") || a.question.includes("medication"))) confidenceScore += 10;
    if (["asdf", "nothing", "idk", "test", "random", "blah"].some(k => combinedStr.includes(k))) {
      confidenceScore -= 20;
    }
    if (confidenceScore > 90) confidenceScore = 90;
    if (confidenceScore < 20) confidenceScore = 20;

    let primaryConcern = "General health discomfort";
    if (combinedStr.includes("fever")) {
      primaryConcern = "Fever or infection-like symptoms";
    } else if (combinedStr.includes("cough") || combinedStr.includes("breathing")) {
      primaryConcern = "Respiratory discomfort";
    } else if (combinedStr.includes("headache")) {
      primaryConcern = "Headache or fatigue-related concern";
    } else if (combinedStr.includes("stomach pain") || combinedStr.includes("vomiting")) {
      primaryConcern = "Digestive discomfort";
    }

    const possibleCauses = [];
    if (primaryConcern === "Fever or infection-like symptoms") {
      possibleCauses.push({ cause: "Viral infection", whyPossible: "Common cause of fever and fatigue." });
      possibleCauses.push({ cause: "Non-specific immune response", whyPossible: "The body may be fighting off a mild pathogen." });
    } else if (primaryConcern === "Respiratory discomfort") {
      possibleCauses.push({ cause: "Respiratory irritation", whyPossible: "Could be related to allergies or mild airway inflammation." });
      possibleCauses.push({ cause: "Mild viral illness", whyPossible: "Often causes coughing and mild respiratory signs." });
    } else if (primaryConcern === "Digestive discomfort") {
      possibleCauses.push({ cause: "Digestive upset", whyPossible: "Could be dietary or mild gastroenteritis." });
      possibleCauses.push({ cause: "Dehydration", whyPossible: "Often accompanies stomach distress." });
    } else {
      possibleCauses.push({ cause: "Stress or poor sleep", whyPossible: "Can cause generalized pain and fatigue." });
      possibleCauses.push({ cause: "Non-specific temporary discomfort", whyPossible: "Many minor symptoms resolve on their own with rest." });
    }

    const whatYouCanDoNow = [
      "Rest",
      "Hydrate",
      "Monitor symptoms",
      "Avoid heavy activity",
      "Keep track of temperature if fever",
      "Seek medical care if symptoms worsen"
    ];

    const preventionTips = [
      "Maintain hydration",
      "Wash hands",
      "Sleep properly",
      "Avoid close contact if fever/cough",
      "Eat light food if stomach discomfort"
    ];

    const whenToSeeDoctor = [
      "If symptoms worsen or persist",
      "If high fever, breathing difficulty, chest pain, fainting, confusion, severe weakness, or dehydration occurs",
      "If user has chronic conditions, pregnancy, elderly age, or severe pain"
    ];

    const redFlags = [
      "Severe chest pain",
      "Trouble breathing",
      "Fainting",
      "Confusion",
      "Seizure",
      "Severe dehydration",
      "Symptoms rapidly worsening"
    ];

    const missingInformation = [
      "Exact temperature",
      "Age",
      "Existing medical conditions",
      "Current medications",
      "Duration clarity",
      "Severity clarity"
    ];

    const unclearOrInvalidResponses = [];
    if (["asdf", "test", "random", "blah", "idk"].some(k => combinedStr.includes(k))) {
      unclearOrInvalidResponses.push("Some responses appear unclear or incomplete, so this assessment may be less reliable.");
    }

    return {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      source: "mock_ai",
      reportTitle: "AI Health Guidance Report",
      urgencyLevel,
      confidenceScore,
      confidenceReason: "Score based on number of questions answered and clarity.",
      primaryConcern,
      summary: "This is a mock AI-generated health overview based on your provided symptoms.",
      possibleCauses,
      whatYouCanDoNow,
      preventionTips,
      whenToSeeDoctor,
      redFlags,
      missingInformation,
      unclearOrInvalidResponses,
      doctorDisclaimer: "This AI assessment is for general guidance only and does not replace consultation with a qualified healthcare professional.",
      responses: aiAnswers
    };
  }

  function isValidAIQuestion(data) {
    if (!data) return false;
    if (data.isFinalQuestion) return true;
    if (!data.questionText) return false;
    if (!["single_select", "multi_select", "text", "scale"].includes(data.type)) return false;
    if (["single_select", "multi_select"].includes(data.type) && !Array.isArray(data.options)) return false;
    return true;
  }

  function isValidAIReport(data) {
    if (!data) return false;
    if (!data.summary && !data.reportTitle) return false;
    if (data.confidenceScore === undefined || data.confidenceScore === null || isNaN(Number(data.confidenceScore))) return false;
    return true;
  }

  async function fetchAINextQuestion(previousAnswers) {
    try {
      const res = await fetch(`${AI_API_BASE_URL}/api/health/next-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok || !json.question) throw new Error(json.error || "Missing question in response");
      if (!isValidAIQuestion(json.question)) throw new Error("Invalid question format from backend");
      return {
        ...json.question,
        allowOther: typeof json.question.allowOther === "boolean" ? json.question.allowOther : false,
        required: typeof json.question.required === "boolean" ? json.question.required : true
      };
    } catch (e) {
      console.warn("fetchAINextQuestion failed, using mock fallback:", e.message);
      return getMockAIQuestion(previousAnswers);
    }
  }

  async function fetchAIReport(aiAnswers) {
    try {
      const res = await fetch(`${AI_API_BASE_URL}/api/health/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: aiAnswers,
        }),
      });

      const data = await res.json();

      console.log("AI report backend response:", data);

      if (!res.ok || !data.ok || !data.report || !isValidAIReport(data.report)) {
        console.warn("AI report failed, using mock fallback:", data);
        return generateMockAIReport(aiAnswers);
      }

      return data.report;
    } catch (error) {
      console.warn("AI report fetch failed, using mock fallback:", error);
      return generateMockAIReport(aiAnswers);
    }
  }

  async function startAIFlow() {
    setLoading(true);
    setError("");
    setReport(null);
    setQuestionHistory([]);
    setAskedQuestions([]);
    setSelectedOptions([]);
    setTextAnswer("");
    setOtherText("");
    try {
      const firstQuestion = await fetchAINextQuestion([]);
      setCurrentQuestion(firstQuestion);
      setAskedQuestions([firstQuestion]);
    } finally {
      setLoading(false);
    }
  }

  function resetAIInputs() {
    setSelectedOptions([]);
    setTextAnswer("");
    setOtherText("");
    setError("");
  }

  async function handleAINext() {
    // Edge case: current question itself is the final marker (e.g. urgent symptoms)
    if (currentQuestion?.isFinalQuestion) {
      setLoading(true);
      setIsGeneratingReport(true);
      try {
        const finalReport = await fetchAIReport(questionHistory);
        console.log("Final report generated:", finalReport);
        setReport(finalReport);
        try {
          const existing = JSON.parse(localStorage.getItem("healthsense_ai_reports") || "[]");
          existing.unshift(finalReport);
          localStorage.setItem("healthsense_ai_reports", JSON.stringify(existing));
        } catch (storageError) {
          console.warn("Failed to save AI report locally:", storageError);
        }
        setCurrentQuestion(null);
        resetAIInputs();
        return;
      } catch (error) {
        console.error("Report generation failed:", error);
        setError("Unable to generate report right now. Please try again.");
        return;
      } finally {
        setIsGeneratingReport(false);
        setLoading(false);
      }
    }

    // Validate current answer
    const finalAnswer = buildAIAnswer();
    if (!isAIAnswerValid(finalAnswer)) {
      setError("Please select or enter an answer before continuing.");
      return;
    }

    const savedAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.questionText,
      type: currentQuestion.type,
      answer: finalAnswer,
      createdAt: new Date().toISOString()
    };

    const updatedAnswers = [...questionHistory, savedAnswer];
    setQuestionHistory(updatedAnswers);
    setLoading(true);

    // Frontend hard limit: force report after 10 answers
    if (updatedAnswers.length >= 10) {
      try {
        setLoading(false);
        setIsGeneratingReport(true);

        const finalReport = await fetchAIReport(updatedAnswers);

        console.log("Final report generated:", finalReport);

        setReport(finalReport);

        try {
          const existing = JSON.parse(localStorage.getItem("healthsense_ai_reports") || "[]");
          existing.unshift(finalReport);
          localStorage.setItem("healthsense_ai_reports", JSON.stringify(existing));
        } catch (storageError) {
          console.warn("Failed to save AI report locally:", storageError);
        }

        setCurrentQuestion(null);
        resetAIInputs();
        return;
      } catch (error) {
        console.error("Forced report generation failed:", error);
        setError("Unable to generate report right now. Please try again.");
        return;
      } finally {
        setIsGeneratingReport(false);
        setLoading(false);
      }
    }

    // Normal flow: ask next question or generate report
    try {
      const nextQuestion = await fetchAINextQuestion(updatedAnswers);

      if (nextQuestion?.isFinalQuestion) {
        try {
          setLoading(false);
          setIsGeneratingReport(true);

          const finalReport = await fetchAIReport(updatedAnswers);

          console.log("Final report generated:", finalReport);

          setReport(finalReport);

          try {
            const existing = JSON.parse(localStorage.getItem("healthsense_ai_reports") || "[]");
            existing.unshift(finalReport);
            localStorage.setItem("healthsense_ai_reports", JSON.stringify(existing));
          } catch (storageError) {
            console.warn("Failed to save AI report locally:", storageError);
          }

          setCurrentQuestion(null);
          resetAIInputs();
          return;
        } catch (error) {
          console.error("Report generation failed:", error);
          setError("Unable to generate report right now. Please try again.");
          return;
        } finally {
          setIsGeneratingReport(false);
          setLoading(false);
        }
      } else {
        setCurrentQuestion(nextQuestion);
        setAskedQuestions((prev) => [...prev, nextQuestion]);
        resetAIInputs();
      }
    } finally {
      setLoading(false);
      setIsGeneratingReport(false);
    }
  }

  function handleAIBack() {
    if (questionHistory.length === 0) {
      setCurrentQuestion(null);
      resetAIInputs();
    } else {
      const updatedHistory = questionHistory.slice(0, -1);
      setQuestionHistory(updatedHistory);
      const prevQuestion = askedQuestions[updatedHistory.length];
      setCurrentQuestion(prevQuestion);
      if (!currentQuestion.isFinalMessage) {
        setAskedQuestions(askedQuestions.slice(0, -1));
      }
      resetAIInputs();
    }
  }

  function toggleOption(option) {
    if (!currentQuestion) return;
    setError("");
    if (currentQuestion.type === "multi_select") {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(o => o !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else if (currentQuestion.type === "single_select") {
      setSelectedOptions([option]);
    }
  }

  function buildAIAnswer() {
    if (!currentQuestion) return "";
    if (currentQuestion.type === "text") {
      return textAnswer.trim();
    }
    if (currentQuestion.type === "scale") {
      const min = currentQuestion.min ?? 0;
      return String(textAnswer !== "" ? textAnswer : String(min === 0 ? 5 : min));
    }
    const finalOptions = selectedOptions.map(opt => {
      if (opt === "Other" && otherText.trim()) {
        return `Other: ${otherText.trim()}`;
      }
      return opt;
    });
    return finalOptions;
  }

  function isAIAnswerValid(answer) {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "text") {
      return typeof answer === "string" && answer.trim().length > 0;
    }
    if (currentQuestion.type === "scale") {
      if (answer === "" || answer === undefined || answer === null) return false;
      const num = Number(answer);
      const min = currentQuestion.min ?? 0;
      const max = currentQuestion.max ?? 10;
      return !isNaN(num) && num >= min && num <= max;
    }
    if (!Array.isArray(answer) || answer.length === 0) return false;
    if (selectedOptions.includes("Other") && !otherText.trim()) return false;
    return true;
  }

  if (currentQuestion && !report) {
    const scaleMin = currentQuestion.min ?? 0;
    const scaleMax = currentQuestion.max ?? 10;
    const scaleValue = textAnswer !== "" ? textAnswer : "5";
    const questionNumber = questionHistory.length + 1;

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[820px] rounded-2xl border border-gray-200 bg-white/90 p-5 md:p-8 shadow-xl shadow-gray-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-black/20 dark:text-gray-300 relative">

          {/* Generating report overlay */}
          {isGeneratingReport && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/80 dark:bg-[#1E293B]/90 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full border-4 border-[#43664d]/20 border-t-[#43664d] animate-spin mb-4" />
              <p className="text-sm font-medium text-[#43664d] dark:text-gray-300">Generating your health report...</p>
              <p className="text-xs text-gray-400 mt-1">This may take a few seconds</p>
            </div>
          )}

          <div className="mb-5 border-b border-gray-200 pb-5 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-[#43664d] dark:text-gray-300">
                AI Health Check
              </h2>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                Question {questionNumber}
              </span>
            </div>
            {currentQuestion.helperText && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {currentQuestion.helperText}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-gray-50 p-4 md:p-6 border border-gray-100 dark:bg-[#0F172A]/60 dark:border-slate-700">
            <label className="block mb-4 text-base md:text-lg text-gray-700 font-medium leading-relaxed dark:text-gray-300">
              {currentQuestion.questionText}
            </label>

            <div className={`pt-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>

              {/* single_select and multi_select */}
              {(currentQuestion.type === "single_select" || currentQuestion.type === "multi_select") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentQuestion.options || []).map(opt => {
                    const isSelected = selectedOptions.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleOption(opt)}
                        className={`text-left px-4 py-3 rounded-xl border font-medium transition-all duration-200 ${
                          isSelected
                            ? "border-[#43664d] bg-[#43664d]/10 text-[#43664d] dark:border-gray-300 dark:bg-[#334155] dark:text-gray-100"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#43664d]/50 hover:bg-gray-50 dark:border-slate-600 dark:bg-[#1E293B] dark:text-gray-300 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                            isSelected
                              ? "border-[#43664d] bg-[#43664d] dark:border-gray-300 dark:bg-gray-300"
                              : "border-gray-300 dark:border-slate-500"
                          }`} />
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Other text input */}
              {selectedOptions.includes("Other") && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={otherText}
                    onChange={(e) => {
                      setOtherText(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#43664d] focus:ring-4 focus:ring-[#43664d]/10 dark:border-slate-600 dark:bg-[#1E293B] dark:text-gray-200 dark:placeholder:text-gray-500"
                  />
                </div>
              )}

              {/* text question */}
              {currentQuestion.type === "text" && (
                <input
                  type="text"
                  placeholder="Your answer"
                  value={textAnswer}
                  onChange={(e) => {
                    setTextAnswer(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#43664d] focus:ring-4 focus:ring-[#43664d]/10 dark:border-slate-600 dark:bg-[#1E293B] dark:text-gray-200 dark:placeholder:text-gray-500"
                />
              )}

              {/* scale question — always numeric slider, ignores options array */}
              {currentQuestion.type === "scale" && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2 px-1">
                    <span>{scaleMin} — No discomfort</span>
                    <span>Worst — {scaleMax}</span>
                  </div>
                  <input
                    type="range"
                    min={scaleMin}
                    max={scaleMax}
                    value={scaleValue}
                    onChange={(e) => {
                      setTextAnswer(e.target.value);
                      setError("");
                    }}
                    className="w-full accent-[#43664d] dark:accent-gray-300 cursor-pointer"
                  />
                  <div className="mt-4 flex items-center justify-center">
                    <span className="rounded-full bg-[#43664d]/10 px-6 py-2 text-xl font-bold text-[#43664d] dark:bg-slate-700 dark:text-gray-200">
                      {scaleValue} / {scaleMax}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              onClick={handleAIBack}
              disabled={loading || isGeneratingReport}
              className="min-w-[100px] rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-800 transition-all duration-200 hover:bg-gray-200 hover:shadow-sm dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#475569] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            <button
              onClick={handleAINext}
              disabled={loading || isGeneratingReport}
              className="min-w-[150px] rounded-xl bg-[#43664d] px-5 py-3 text-sm font-medium text-white shadow-md shadow-[#43664d]/20 transition-all duration-200 hover:bg-[#35513d] hover:shadow-lg hover:shadow-[#43664d]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingReport
                ? "Generating Report..."
                : loading
                ? "Thinking..."
                : currentQuestion?.isFinalQuestion
                ? "Generate Report"
                : "Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[820px] rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-xl shadow-gray-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-black/20 dark:text-gray-300">
          <div className="mb-7 border-b border-gray-200 pb-5 dark:border-slate-700">
            <p className="mb-2 text-sm font-medium tracking-wide text-[#43664d] dark:text-gray-400">
              Adaptive AI questionnaire
            </p>

            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#43664d] dark:text-gray-200">
              AI Health Check
            </h2>

            <p className="mt-4 max-w-[620px] text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Answer a few adaptive questions and get a safe AI-generated health guidance report.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 md:p-6 border border-gray-100 dark:bg-[#0F172A]/60 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              This is not a medical diagnosis and does not replace a doctor.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              AI-generated guidance is for informational support only. For serious, worsening, or emergency symptoms, seek medical help.
            </p>
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-7 flex justify-end">
            <button
              onClick={startAIFlow}
              disabled={loading || isGeneratingReport}
              className="rounded-xl bg-[#43664d] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#43664d]/20 transition-all duration-200 hover:bg-[#35513d] hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Starting..." : "Start AI Health Check"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  const reportTitle = report.reportTitle || "AI Health Guidance Report";
  const urgency = report.urgencyLevel || "General";
  const confidence = report.confidenceScore ?? report.confidence ?? 0;
  const primaryConcern = report.primaryConcern || report.primary || "General health concern";
  const summary =
    report.summary ||
    report.insights?.advice ||
    "Based on your responses, here is a general health guidance summary.";

  const possibleCauses =
    report.possibleCauses ||
    (report.insights?.causes || []).map((cause) => ({
      cause,
      whyPossible: "This may be related to the symptoms you provided.",
    }));

  const whatYouCanDoNow =
    report.whatYouCanDoNow ||
    (report.insights?.advice ? [report.insights.advice] : []);

  const preventionTips =
    report.preventionTips || report.insights?.prevention || [];
  
  const whenToSeeDoctor =
    report.whenToSeeDoctor || [
      "Consult a healthcare professional if symptoms persist, worsen, or feel concerning.",
    ];

  const redFlags =
    report.redFlags || [
      "Severe chest pain",
      "Trouble breathing",
      "Fainting",
      "Confusion",
      "Symptoms rapidly worsening",
    ];

  const missingInformation = report.missingInformation || [];
  const unclearOrInvalidResponses = report.unclearOrInvalidResponses || [];

  const disclaimer =
    report.doctorDisclaimer ||
    "This AI assessment is for general guidance only and does not replace consultation with a qualified healthcare professional.";

  let urgencyColor = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
  const uLower = urgency.toLowerCase();
  if (uLower.includes("urgent")) {
    urgencyColor = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
  } else if (uLower.includes("high")) {
    urgencyColor = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  } else if (uLower.includes("moderate")) {
    urgencyColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
  }

  return (
    <div className="max-w-[1100px] mx-4 md:mx-auto my-8">
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 md:p-8 shadow-xl shadow-gray-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-[#1E293B] dark:text-gray-300 dark:shadow-black/20">
        
        {/* Header section */}
        <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-slate-700 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-[#43664d] dark:text-gray-200">
                {reportTitle}
              </h2>
              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${urgencyColor}`}>
                {urgency}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Generated on {new Date(report.createdAt).toLocaleString()}
            </p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-[#0F172A]/60">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Primary Concern</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{primaryConcern}</p>
            </div>
          </div>
          
          <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-[#0F172A]/60 md:w-[260px] md:shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Assessment Confidence
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Based on response clarity, not diagnosis certainty.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[#43664d]/20 bg-white text-lg font-bold text-[#43664d] dark:bg-[#334155] dark:text-gray-100">
                {confidence}%
              </div>
            </div>

            {report.confidenceReason && (
              <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {report.confidenceReason}
              </p>
            )}
          </div>
        </div>

        {/* Summary card */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-[#0F172A]/60">
          <h3 className="text-lg font-semibold text-[#43664d] dark:text-gray-200">Summary Overview</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {summary}
          </p>
        </section>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]/60">
            <h4 className="font-semibold text-[#43664d] dark:text-gray-200">
              Possible Causes
            </h4>
            <ul className="mt-4 space-y-4">
              {possibleCauses.length > 0 ? possibleCauses.map((c, i) => (
                <li key={i} className="text-gray-700 dark:text-gray-300 text-sm">
                  <span className="block font-medium text-gray-900 dark:text-gray-100 mb-1">{c.cause}</span>
                  <span className="text-gray-500 dark:text-gray-400">{c.whyPossible}</span>
                </li>
              )) : <li className="text-gray-500 text-sm">Not enough data to determine causes.</li>}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]/60">
            <h4 className="font-semibold text-[#43664d] dark:text-gray-200">
              What You Can Do Now
            </h4>
            <ul className="mt-4 space-y-2 list-disc pl-4 text-sm text-gray-700 dark:text-gray-300">
              {whatYouCanDoNow.length > 0 ? whatYouCanDoNow.map((item, i) => (
                <li key={i} className="pl-1">{item}</li>
              )) : <li>No specific immediate steps available.</li>}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]/60">
            <h4 className="font-semibold text-[#43664d] dark:text-gray-200">
              Prevention Tips
            </h4>
            <ul className="mt-4 space-y-2 list-disc pl-4 text-sm text-gray-700 dark:text-gray-300">
              {preventionTips.length > 0 ? preventionTips.map((item, i) => (
                <li key={i} className="pl-1">{item}</li>
              )) : <li>General health precautions recommended.</li>}
            </ul>
          </div>
        </div>

        {/* Safety grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]/60">
            <h4 className="font-semibold text-red-800 dark:text-red-400">
              When To See A Doctor
            </h4>
            <ul className="mt-4 space-y-2 list-disc pl-4 text-sm text-gray-700 dark:text-gray-300">
              {whenToSeeDoctor.map((item, i) => (
                <li key={i} className="pl-1">{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]/60">
            <h4 className="font-semibold text-red-800 dark:text-red-400">
              Red Flags to Watch For
            </h4>
            <ul className="mt-4 space-y-2 list-disc pl-4 text-sm text-gray-700 dark:text-gray-300">
              {redFlags.map((item, i) => (
                <li key={i} className="pl-1">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Context section */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-[#0F172A]/60">
          <h3 className="text-lg font-semibold text-[#43664d] dark:text-gray-200">Your Responses</h3>
          
          <div className="mt-4 space-y-3">
            {report.responses?.map((r, i) => {
              const renderedAnswer = Array.isArray(r.answer)
                ? r.answer.join(", ")
                : r.answer || "—";

              return (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-[#1E293B]">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{r.question}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{renderedAnswer}</p>
                </div>
              );
            })}
          </div>

          {(missingInformation.length > 0 || unclearOrInvalidResponses.length > 0) && (
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-200 pt-5 dark:border-slate-700 sm:grid-cols-2">
              {missingInformation.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-[#1E293B]">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Missing Information</h5>
                  <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400">
                    {missingInformation.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              {unclearOrInvalidResponses.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-[#1E293B]">
                  <h5 className="text-sm font-medium text-yellow-700 dark:text-yellow-500 mb-2">Unclear Responses</h5>
                  <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400">
                    {unclearOrInvalidResponses.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer box */}
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {disclaimer}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setReport(null);
              setCurrentQuestion(null);
              setQuestionHistory([]);
              setAskedQuestions([]);
              setSelectedOptions([]);
              setTextAnswer("");
              setOtherText("");
              setError("");
              setLoading(false);
              setIsGeneratingReport(false);
            }}
            className="rounded-xl bg-[#43664d] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#43664d]/20 transition-all duration-200 hover:bg-[#35513d] hover:shadow-xl hover:-translate-y-0.5"
          >
            Start New Check
          </button>
        </div>

      </div>
    </div>
  );
}
