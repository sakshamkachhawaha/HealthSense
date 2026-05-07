import React from 'react'
import { useState } from "react";

function HealthCheck() {
  const questions = [
    {
      question: "What's your primary symptom today?",
      options: [
        "Headache",
        "Fever",
        "Cough",
        "Fatigue",
        "Body Pain",
        "Nausea",
        "Other",
      ],
    },
    {
      question: "How long have you been experiencing this?",
      options: [
        "Less than a day",
        "1–3 days",
        "4–7 days",
        "1–2 weeks",
        "More than 2 weeks",
      ],
    },
    {
      question: "How would you rate your pain or discomfort?",
      slider: true,
    },
    {
      question: "Have you noticed any fever?",
      yesno: true,
    },
    {
      question: "Are you experiencing any breathing difficulties?",
      yesno: true,
    },
    {
      question: "How has your energy level been?",
      options: [
        "Normal",
        "Slightly low",
        "Quite tired",
        "Exhausted",
      ],
    },
    {
      question: "Any changes in appetite or sleep?",
      options: [
        "No changes",
        "Less appetite",
        "Poor sleep",
        "Both affected",
      ],
    },
    {
      question: "Any known allergies or chronic conditions?",
      options: [
        "None",
        "Allergies",
        "Asthma",
        "Diabetes",
        "Heart condition",
        "Other",
      ],
    },
    {
      question: "Have you taken any medication for this?",
      options: [
        "None",
        "Over-the-counter",
        "Prescribed medication",
        "Home remedies",
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [painLevel, setPainLevel] = useState(5);
  const [result, setResult] = useState("");

  const current = questions[step];

  const handleOption = (value) => {
    setAnswers({
      ...answers,
      [step]: value,
    });
  };

  const nextStep = () => {
    if (step === questions.length - 1) {
      generateResult();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const generateResult = () => {
    const symptom = answers[0];

    if (symptom === "Fever" || symptom === "Cough") {
      setResult(
        "You may have a viral infection or flu. Stay hydrated and monitor your symptoms."
      );
    } else if (symptom === "Headache") {
      setResult(
        "Your symptoms may indicate stress, dehydration, or migraine."
      );
    } else if (symptom === "Fatigue") {
      setResult(
        "Your body may need proper rest, hydration, and nutrition."
      );
    } else {
      setResult(
        "Please consult a healthcare professional if symptoms continue."
      );
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex justify-center items-center">

      <div className="bg-white w-full h-full md:w-[500px] md:h-auto shadow-xl p-8 flex flex-col justify-center">

        {!result ? (
          <>
            {/* Heading */}
            <p className="text-sm text-gray-500 mb-2">
              HealthSense AI is asking...
            </p>

            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              {current.question}
            </h2>

            {/* MCQ OPTIONS */}
            {current.options && (
              <div className="space-y-4">
                {current.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOption(option)}
                    className={`w-full border rounded-xl p-4 text-left transition duration-200 hover:bg-blue-50 ${
                      answers[step] === option
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* YES NO */}
            {current.yesno && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleOption("Yes")}
                  className={`flex-1 border p-5 rounded-xl transition ${
                    answers[step] === "Yes"
                      ? "bg-green-100 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  Yes
                </button>

                <button
                  onClick={() => handleOption("No")}
                  className={`flex-1 border p-5 rounded-xl transition ${
                    answers[step] === "No"
                      ? "bg-red-100 border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  No
                </button>
              </div>
            )}

            {/* SLIDER */}
            {current.slider && (
              <div className="mt-6">

                <div className="flex justify-between text-sm mb-3 text-gray-600">
                  <span>No pain</span>
                  <span>Severe</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(e.target.value)}
                  className="w-full"
                />

                <p className="text-center mt-4 text-2xl font-semibold">
                  {painLevel}/10
                </p>

              </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between mt-10 gap-4">

              <button
                onClick={prevStep}
                disabled={step === 0}
                className="w-1/2 bg-gray-300 py-3 rounded-xl disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Prev
              </button>

              <button
                onClick={nextStep}
                className="w-1/2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
              >
                {step === questions.length - 1
                  ? "Get Results"
                  : "Continue"}
              </button>

            </div>
          </>
        ) : (
          <div className="text-center">

            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Your Health Analysis
            </h2>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {result}
            </p>

            <button
              onClick={() => {
                setStep(0);
                setAnswers({});
                setResult("");
              }}
              className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Restart
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default HealthCheck;