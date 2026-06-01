import { useMemo, useState } from "react";

function getStoredHealthReports() {
  try {
    const aiReports = JSON.parse(localStorage.getItem("healthsense_ai_reports") || "[]");
    const oldReports = JSON.parse(localStorage.getItem("healthsense_reports") || "[]");

    if (Array.isArray(aiReports) && aiReports.length > 0) {
      return aiReports;
    }

    if (Array.isArray(oldReports) && oldReports.length > 0) {
      return oldReports;
    }

    return [];
  } catch (error) {
    console.error("Failed to read health reports from localStorage:", error);
    return [];
  }
}

function getUrgencyBadgeClass(urgency) {
  const normalized = String(urgency || "").toLowerCase();
  const baseClass = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold";

  if (normalized.includes("urgent")) {
    return `${baseClass} bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800`;
  }

  if (normalized.includes("high")) {
    return `${baseClass} bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800`;
  }

  if (normalized.includes("moderate")) {
    return `${baseClass} bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800`;
  }

  if (normalized.includes("low")) {
    return `${baseClass} bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800`;
  }

  return `${baseClass} bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#334155] dark:text-gray-300 dark:border-slate-600`;
}

function getReportDisplayTitle(report) {
  const primary =
    report.primaryConcern ||
    report.primary ||
    "";

  const urgency =
    report.urgencyLevel ||
    report.severity ||
    "";

  const responses = Array.isArray(report.responses) ? report.responses : [];

  const firstSymptomResponse = responses.find((item) => {
    const q = String(item.question || "").toLowerCase();
    return (
      q.includes("symptom") ||
      q.includes("experiencing") ||
      q.includes("concern") ||
      q.includes("pain") ||
      q.includes("discomfort")
    );
  });

  let symptomText = "";

  if (firstSymptomResponse) {
    const ans = firstSymptomResponse.answer;
    symptomText = Array.isArray(ans) ? ans.join(", ") : String(ans || "");
  }

  if (primary && primary !== "General health concern") {
    return primary;
  }

  if (symptomText && symptomText.length > 0) {
    return `${symptomText.split(",").slice(0, 2).join(", ")} Check`;
  }

  if (urgency && urgency !== "General") {
    return `${urgency} Health Check`;
  }

  return "Health Check Summary";
}

function getReportContextPreview(report) {
  const responses = Array.isArray(report.responses) ? report.responses : [];

  const usefulResponses = responses.filter((item) => {
    const q = String(item.question || "").toLowerCase();
    return (
      q.includes("symptom") ||
      q.includes("experiencing") ||
      q.includes("duration") ||
      q.includes("long") ||
      q.includes("severity") ||
      q.includes("pain") ||
      q.includes("warning") ||
      q.includes("medicine") ||
      q.includes("medication") ||
      q.includes("action")
    );
  });

  return usefulResponses.slice(0, 3).map((item) => {
    const answer = Array.isArray(item.answer)
      ? item.answer.join(", ")
      : item.answer || "—";

    return {
      question: item.question || "Question",
      answer,
    };
  });
}

function getMemoryNote(report) {
  const urgency = report.urgencyLevel || report.severity || "General";
  const confidence = report.confidenceScore ?? report.confidence ?? 0;
  const summary = report.summary || report.insights?.advice || "";

  if (urgency === "Urgent") {
    return "Marked urgent during this checkup.";
  }

  if (urgency === "High") {
    return "This checkup showed higher concern than usual.";
  }

  if (confidence && confidence < 50) {
    return "Assessment had limited confidence due to unclear or incomplete answers.";
  }

  if (summary) {
    return summary.length > 120 ? `${summary.slice(0, 120)}...` : summary;
  }

  return "Saved health check summary.";
}

const Report = () => {
  const [reports] = useState(getStoredHealthReports);

  const averageConfidence = useMemo(() => {
    if (reports.length === 0) return 0;

    const total = reports.reduce((sum, report) => {
      const confidence = report.confidenceScore ?? report.confidence ?? 0;
      return sum + Number(confidence || 0);
    }, 0);

    return Math.round(total / reports.length);
  }, [reports]);

  const latestReport = reports[0];
  const latestUrgency = latestReport
    ? latestReport.urgencyLevel ?? latestReport.severity ?? "General"
    : "No reports";

  return (
    <div className="bg-gray-100 p-3 md:p-4 dark:bg-[#0F172A]">
      <div className="max-w-[1100px] mx-4 md:mx-auto my-8">
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 md:p-7 shadow-xl shadow-gray-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-[#1E293B] dark:text-gray-300 dark:shadow-black/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-light text-[#43664d] dark:text-gray-200">
                Reports
              </h1>
              <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                View your past health check reports and AI health guidance summaries.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-slate-700 dark:bg-[#334155] dark:text-gray-300">
              {reports.length} {reports.length === 1 ? "report" : "reports"}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1E293B] dark:text-gray-300">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Reports</p>
            <p className="mt-2 text-2xl font-semibold text-[#43664d] dark:text-gray-100">{reports.length}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1E293B] dark:text-gray-300">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Latest Urgency</p>
            <div className="mt-3">
              <span className={getUrgencyBadgeClass(latestUrgency)}>
                {latestUrgency}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1E293B] dark:text-gray-300">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Average Confidence</p>
            <p className="mt-2 text-2xl font-semibold text-[#43664d] dark:text-gray-100">{averageConfidence}%</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-serif font-light text-[#43664d] dark:text-gray-200">
            Recent Reports
          </h2>

          {reports.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-[#1E293B] dark:text-gray-300">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">No reports yet.</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Complete an AI health check to see your reports here.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5">
              {reports.map((report, reportIndex) => {
                const confidence = report.confidenceScore ?? report.confidence ?? 0;
                const urgency = report.urgencyLevel ?? report.severity ?? "General";
                const primary = report.primaryConcern ?? report.primary ?? "General health concern";
                const createdAt = report.createdAt ?? report.date ?? null;
                const summary = report.summary ?? report.insights?.advice ?? "No summary available.";
                const responses = Array.isArray(report.responses) ? report.responses : [];
                const title = getReportDisplayTitle(report);
                const contextPreview = getReportContextPreview(report);
                const memoryNote = getMemoryNote(report);
                const shortMemoryNote =
                  memoryNote.length > 160 ? `${memoryNote.slice(0, 160)}...` : memoryNote;
                const reportKey = report.id ?? createdAt ?? reportIndex;

                const possibleCauses =
                  report.possibleCauses ||
                  (report.insights?.causes || []).map((cause) => ({
                    cause,
                    whyPossible: "",
                  }));

                return (
                  <article
                    key={reportKey}
                    className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-[#1E293B]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl font-light text-[#43664d] dark:text-gray-200">
                          {title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {createdAt ? new Date(createdAt).toLocaleString() : "Unknown date"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <span className={getUrgencyBadgeClass(urgency)}>
                          {urgency}
                        </span>
                        <div className="rounded-full bg-[#43664d]/10 px-3 py-1 text-xs font-semibold text-[#43664d] dark:bg-[#334155] dark:text-gray-100">
                          {confidence}% confidence
                        </div>
                        <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 dark:border-slate-700 dark:bg-[#334155] dark:text-gray-300">
                          {responses.length} {responses.length === 1 ? "response" : "responses"}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-[#0F172A]/60">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Primary Concern
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {primary}
                      </p>
                    </div>

                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {shortMemoryNote || summary}
                    </p>

                    {contextPreview.length > 0 && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-[#0F172A]/60">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Symptoms / Context
                        </p>
                        <div className="mt-3 space-y-2">
                          {contextPreview.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-1 rounded-lg bg-white px-3 py-2 dark:bg-[#334155]"
                            >
                              <span className="text-xs text-gray-500 dark:text-gray-400">{item.question}</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.answer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {possibleCauses.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {possibleCauses.slice(0, 2).map((cause, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 dark:border-slate-700 dark:bg-[#0F172A]/60 dark:text-gray-300"
                          >
                            {cause.cause ?? cause}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-slate-700 dark:text-gray-400">
                      Saved from AI Health Check
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
              </div>
    </div>
  );
};

export default Report;
