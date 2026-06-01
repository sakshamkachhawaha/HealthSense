import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from "openai";
import Groq from "groq-sdk";
import { QUESTION_GENERATION_PROMPT, REPORT_GENERATION_PROMPT } from './prompts.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5001;

const MIN_QUESTIONS = 5;
const IDEAL_MAX_QUESTIONS = 8;
const HARD_MAX_QUESTIONS = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "missing",
});

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

async function callAIJson({ systemPrompt, userPrompt }) {
  let lastError = new Error("No AI providers configured.");

  if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });
      const aiContent = response.choices[0].message.content;
      try {
        return JSON.parse(aiContent);
      } catch (err) {
        throw new Error("Invalid JSON returned by AI provider");
      }
    } catch (error) {
      console.warn("OpenAI failed, falling back to Groq:", error.message);
      lastError = error;
    }
  }

  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });
      const aiContent = response.choices[0].message.content;
      try {
        return JSON.parse(aiContent);
      } catch (err) {
        throw new Error("Invalid JSON returned by AI provider");
      }
    } catch (error) {
      console.warn("Groq failed:", error.message);
      lastError = error;
    }
  }

  throw lastError;
}

function answerText(answers) {
  return answers
    .map((item) => {
      const ans = Array.isArray(item.answer) ? item.answer.join(" ") : item.answer;
      return `${item.question || ""} ${ans || ""}`;
    })
    .join(" ")
    .toLowerCase();
}

function hasUrgentSymptoms(answers) {
  const text = answerText(answers);
  const urgentKeywords = [
    "chest pain", "severe chest pain", "difficulty breathing", "breathing difficulty",
    "shortness of breath", "can't breathe", "cannot breathe", "fainting",
    "loss of consciousness", "unconscious", "confusion", "seizure", "stroke",
    "face drooping", "slurred speech", "heavy bleeding", "severe allergic reaction",
    "swelling of face", "suicidal", "self harm", "severe dehydration"
  ];
  return urgentKeywords.some((keyword) => text.includes(keyword));
}

function normalizeQuestion(question, previousAnswers) {
  if (!question || typeof question !== "object") return question;

  if (question.isFinalQuestion) {
    if (previousAnswers.length < MIN_QUESTIONS && !hasUrgentSymptoms(previousAnswers)) {
      return null; // too early — backend will substitute fallback
    }
    return {
      isFinalQuestion: true,
      reason: question.reason || "ai_decided_ready"
    };
  }

  const allowedTypes = ["single_select", "multi_select", "text", "scale"];
  if (!allowedTypes.includes(question.type)) {
    question.type = "single_select";
  }

  if (question.type === "scale") {
    question.options = [];
    question.min = 0;
    question.max = 10;
    question.helperText = question.helperText || "Use 0 for no discomfort and 10 for the worst discomfort.";
  }

  if (question.type === "single_select" || question.type === "multi_select") {
    if (!Array.isArray(question.options)) question.options = [];
    question.options = question.options
      .filter(Boolean)
      .map((o) => String(o).trim())
      .filter((o) => o.length > 0);
    if (question.allowOther !== false && !question.options.includes("Other")) {
      question.options.push("Other");
    }
    if (question.options.length < 3) {
      question.options = ["Yes", "No", "Not sure", "Other"];
    }
  }

  question.allowOther = Boolean(question.allowOther);
  question.required = question.required !== false;
  question.id = question.id || `q_${previousAnswers.length + 1}`;
  question.questionText = question.questionText || "Can you share more about what you are experiencing?";
  question.helperText = question.helperText || "Choose the option that best matches your situation.";
  question.isFinalQuestion = false;

  return question;
}

function getFallbackQuestionByCount(count) {
  const fallbackQuestions = [
    {
      id: "fallback_symptoms", questionText: "Which symptoms are you experiencing right now?",
      type: "multi_select",
      options: ["Fever", "Cough", "Headache", "Body pain", "Fatigue", "Stomach pain", "Breathing difficulty", "Other"],
      allowOther: true, required: true, helperText: "Select all symptoms that apply.", isFinalQuestion: false
    },
    {
      id: "fallback_duration", questionText: "How long have you been experiencing these symptoms?",
      type: "single_select",
      options: ["Less than 24 hours", "1-2 days", "3-5 days", "More than a week", "More than a month", "Other"],
      allowOther: true, required: true, helperText: "Duration helps understand urgency.", isFinalQuestion: false
    },
    {
      id: "fallback_severity", questionText: "How severe is your discomfort on a scale of 0 to 10?",
      type: "scale", options: [], allowOther: false, required: true,
      helperText: "0 means no discomfort, 10 means worst discomfort.", isFinalQuestion: false
    },
    {
      id: "fallback_warning", questionText: "Are you experiencing any of these warning signs?",
      type: "multi_select",
      options: ["Chest pain", "Breathing difficulty", "Fainting", "Confusion", "Persistent vomiting", "Severe weakness", "None of these", "Other"],
      allowOther: true, required: true, helperText: "These symptoms may need urgent medical attention.", isFinalQuestion: false
    },
    {
      id: "fallback_action", questionText: "Have you taken any action or medication for this?",
      type: "multi_select",
      options: ["Rested", "Drank fluids", "Took over-the-counter medicine", "Consulted a doctor", "No action yet", "Other"],
      allowOther: true, required: true, helperText: "This helps understand what has already been tried.", isFinalQuestion: false
    }
  ];
  return fallbackQuestions[count] || fallbackQuestions[fallbackQuestions.length - 1];
}

function isValidQuestion(question) {
  if (!question) return false;
  if (question.isFinalQuestion === true) return true;
  if (typeof question.questionText !== 'string') return false;
  if (!['single_select', 'multi_select', 'text', 'scale'].includes(question.type)) return false;
  // scale questions are valid with empty options
  if (['single_select', 'multi_select'].includes(question.type) && !Array.isArray(question.options)) return false;
  return true;
}

function isValidReport(report) {
  return (
    report &&
    typeof report === "object" &&
    typeof report.summary === "string" &&
    typeof report.reportTitle === "string" &&
    typeof report.confidenceScore === "number" &&
    Array.isArray(report.possibleCauses) &&
    Array.isArray(report.whatYouCanDoNow) &&
    Array.isArray(report.preventionTips) &&
    Array.isArray(report.whenToSeeDoctor) &&
    Array.isArray(report.redFlags)
  );
}

// Test route
app.get('/api/health/ping', (req, res) => {
  res.json({ ok: true, message: "Health AI backend is running" });
});

app.post('/api/health/next-question', async (req, res) => {
  const previousAnswers = Array.isArray(req.body.previousAnswers)
    ? req.body.previousAnswers
    : [];

  console.log("Generating next health question. Previous answers:", previousAnswers.length);

  // Hard guard: urgent symptoms detected
  if (hasUrgentSymptoms(previousAnswers)) {
    console.log("Urgent symptoms detected — forcing final.");
    return res.json({
      ok: true,
      question: { isFinalQuestion: true, reason: "urgent_symptoms_detected" }
    });
  }

  // Hard guard: max question limit
  if (previousAnswers.length >= HARD_MAX_QUESTIONS) {
    console.log("Hard question limit reached — forcing final.");
    return res.json({
      ok: true,
      question: { isFinalQuestion: true, reason: "hard_question_limit_reached" }
    });
  }

  // Build dynamic prompt context hint
  let promptHint = "";
  if (previousAnswers.length < MIN_QUESTIONS) {
    promptHint = `The user has answered only ${previousAnswers.length} questions. Ask the next most useful question. Do not return isFinalQuestion true unless urgent symptoms are present.`;
  } else if (previousAnswers.length >= IDEAL_MAX_QUESTIONS) {
    promptHint = `The user has already answered ${previousAnswers.length} questions. You should return isFinalQuestion true unless one critical safety question is still missing.`;
  } else {
    promptHint = `The user has answered ${previousAnswers.length} questions so far.`;
  }

  const userPrompt = `${promptHint}

Previous answers:
${JSON.stringify(previousAnswers, null, 2)}

Return only valid JSON for the next question or isFinalQuestion.`;

  try {
    let question = await callAIJson({
      systemPrompt: QUESTION_GENERATION_PROMPT,
      userPrompt
    });

    question = normalizeQuestion(question, previousAnswers);

    // AI tried to finish too early before minimum questions — use a fallback
    if (question === null) {
      console.warn("AI tried to finish before MIN_QUESTIONS — using fallback question.");
      question = getFallbackQuestionByCount(previousAnswers.length);
    }

    if (!isValidQuestion(question)) {
      return res.status(500).json({
        ok: false,
        error: "AI question validation failed"
      });
    }

    res.json({ ok: true, question });
  } catch (error) {
    console.error("AI next-question error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      response: error.response?.data,
      stack: error.stack,
    });

    return res.status(500).json({
      ok: false,
      error: "Failed to fetch question from AI",
      details: error.message || "Unknown server error",
      code: error.code || null,
      status: error.status || null,
    });
  }
});

app.post('/api/health/generate-report', async (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({
      ok: false,
      error: "answers array is required",
    });
  }

  console.log("Generating AI health report. Answers count:", answers.length);

  try {
    const report = await callAIJson({
      systemPrompt: REPORT_GENERATION_PROMPT,
      userPrompt: `Generate a safe AI health guidance report from these answers:\n${JSON.stringify(answers, null, 2)}\n\nReturn only JSON matching the required schema.`,
    });

    // Ensure required fields are present
    report.id = report.id || Date.now().toString();
    report.createdAt = report.createdAt || new Date().toISOString();
    report.source = "real_ai";
    report.responses = answers;
    report.doctorDisclaimer = report.doctorDisclaimer ||
      "This AI assessment is for general guidance only and does not replace consultation with a qualified healthcare professional.";

    if (!isValidReport(report)) {
      return res.status(500).json({
        ok: false,
        error: "AI report validation failed",
      });
    }

    res.json({ ok: true, report });
  } catch (error) {
    console.error("AI report error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });

    return res.status(500).json({
      ok: false,
      error: "Failed to generate AI report",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Health AI backend running on http://localhost:${PORT}`);
});

