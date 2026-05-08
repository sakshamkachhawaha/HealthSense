import React, { useEffect, useState } from "react";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    try {
      const storedReports = JSON.parse(
        localStorage.getItem("healthsense_reports") || "[]"
      );

      setReports(storedReports);
    } catch (error) {
      console.error("Error loading reports", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-4 dark:bg-[#0F172A]">


      <div className="bg-white border rounded-xl p-3 mb-4 shadow-sm dark:bg-[#1E293B] dark:border-gray-600">
        <h1 className="text-center text-lg font-semibold dark:text-gray-300">
          Health Sense Reports
        </h1>
      </div>


      {reports.length === 0 && (
        <div className="bg-white p-6 rounded-xl text-center shadow dark:bg-[#1E293B] dark:text-gray-300">
          <p className="text-gray-500 dark:text-gray-400">No Reports Found</p>
        </div>
      )}


      <div className="space-y-3">

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-[#1E293B] dark:border-gray-600"
          >


            <div
              onClick={() =>
                setSelectedReport(
                  selectedReport === report.id ? null : report.id
                )
              }
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition dark:hover:bg-gray-600"
            >

              <div className="flex items-center gap-3">


                <div className="w-12 h-12 rounded-full border-2 border-red-300 flex items-center justify-center text-sm font-bold text-red-500">
                  {report.confidence}%
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-300">
                    {report.insights?.disease}
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {report.primary}
                  </p>

                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-gray-400 text-xl">
                {selectedReport === report.id ? "−" : "+"}
              </div>
            </div>


            {selectedReport === report.id && (
              <div className="border-t p-4 bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600">


                <div className="mb-4">
                  <span className="text-sm font-semibold dark:text-gray-300">
                    Severity:
                  </span>{" "}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {report.severity}
                  </span>
                </div>


                <div className="mb-4">
                  <h3 className="font-semibold mb-2 dark:text-gray-300">
                    Responses
                  </h3>

                  <div className="space-y-2">
                    {report.responses.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-2 rounded-lg border text-sm dark:bg-[#1E293B] dark:border-gray-600"
                      >
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {item.question}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400">
                          {item.answer || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="mb-4">
                  <h3 className="font-semibold mb-2 dark:text-gray-300">
                    Possible Causes
                  </h3>

                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                    {report.insights?.causes?.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>


                <div className="mb-4">
                  <h3 className="font-semibold mb-2 dark:text-gray-300">
                    Next Steps
                  </h3>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {report.insights?.advice}
                  </p>
                </div>


                <div>
                  <h3 className="font-semibold mb-2 dark:text-gray-300">
                    Prevention
                  </h3>

                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                    {report.insights?.prevention?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;