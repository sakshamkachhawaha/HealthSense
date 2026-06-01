import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { HeartPlus } from 'lucide-react'
import { Zap } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { ChartNoAxesCombined } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { ClipboardList } from 'lucide-react'
import { TriangleAlert } from 'lucide-react'
import { Droplet } from 'lucide-react'
import { Moon } from 'lucide-react'
import { Flower } from 'lucide-react'
import { Footprints } from 'lucide-react'

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

function getReportDisplayTitle(report) {
  const primary = String(report.primaryConcern || report.primary || "").trim();

  const genericTitles = [
    "AI Health Guidance Report",
    "AI Generated Health Report",
    "Health Assessment Report",
    "Health Check Summary",
    "General health concern",
    "General Health Concern",
  ];

  if (primary && !genericTitles.includes(primary)) {
    return primary;
  }

  const responses = Array.isArray(report.responses) ? report.responses : [];

  const symptomResponse = responses.find((item) => {
    const q = String(item.question || "").toLowerCase();
    return (
      q.includes("symptom") ||
      q.includes("experiencing") ||
      q.includes("pain") ||
      q.includes("discomfort") ||
      q.includes("concern")
    );
  });

  if (symptomResponse) {
    const answer = Array.isArray(symptomResponse.answer)
      ? symptomResponse.answer.join(", ")
      : String(symptomResponse.answer || "");

    const cleanAnswer = answer
      .replace("Other:", "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");

    if (cleanAnswer) {
      return `${cleanAnswer} Check`;
    }
  }

  const possibleCauses =
    report.possibleCauses ||
    (report.insights?.causes || []).map((cause) => ({ cause }));

  if (Array.isArray(possibleCauses) && possibleCauses.length > 0) {
    const cause = String(
      possibleCauses[0]?.cause || possibleCauses[0] || ""
    ).trim();

    if (cause && !genericTitles.includes(cause)) {
      return `${cause} Review`;
    }
  }

  const urgency = report.urgencyLevel || report.severity || "";

  if (urgency && urgency !== "General") {
    return `${urgency} Concern Check`;
  }

  return "Past Health Check";
}

const Home = () => {

  const navigate = useNavigate()

  const loadReports = () => {
    return getStoredHealthReports()
  }

  const [reports, setReports] = useState(loadReports())

  useEffect(() => {

    const refresh = () => setReports(loadReports())

    window.addEventListener('focus', refresh)

    return () => window.removeEventListener('focus', refresh)

  }, [])

  const sortedReports = useMemo(() => reports, [reports])

  const latestReport = reports[0]
  const latestConfidence = latestReport?.confidenceScore ?? latestReport?.confidence ?? 0
  const latestCreatedAt = latestReport?.createdAt ?? latestReport?.date ?? null

  const cards = [
    {
      title: 'Last Score',
      value: latestReport ? `${latestConfidence}%` : '--',
      icon: <ChartNoAxesCombined size={45} className='bg-green-200 p-2 rounded-2xl dark:text-black'/>
    },
    {
      title: 'Last Check',
      value: latestCreatedAt ? new Date(latestCreatedAt).toLocaleDateString() : '--',
      icon: <CalendarDays size={45} className='bg-yellow-200 p-2 rounded-2xl dark:text-black'/>
    },
    {
      title: 'Total Checks',
      value: reports.length,
      icon: <ClipboardList size={45} className='bg-slate-300 p-2 rounded-2xl dark:text-black'/>
    },
    {
      title: 'Status',
      value:
        reports.some(r => (r.urgencyLevel ?? r.severity ?? 'General') === 'High Concern' || (r.urgencyLevel ?? r.severity ?? 'General') === 'High' || (r.urgencyLevel ?? r.severity ?? 'General') === 'Urgent')
          ? 'High Concern'
          : reports.some(r => (r.urgencyLevel ?? r.severity ?? 'General') === 'Moderate Concern' || (r.urgencyLevel ?? r.severity ?? 'General') === 'Moderate')
          ? 'Moderate'
          : 'Good',
      icon: <TriangleAlert size={45} className='bg-red-200 p-2 rounded-2xl dark:text-black'/>
    }
  ]

  const wellness = [
    {
      title: 'Stay Hydrated',
      text: 'Drink 8 glasses of water daily',
      icon: <Droplet size={25} className='text-green-900 dark:text-green-300'/>
    },
    {
      title: 'Quality Sleep',
      text: 'Aim for 7-9 hours each night',
      icon: <Moon size={25} className='text-green-900 dark:text-green-300'/>
    },
    {
      title: 'Mindfulness',
      text: '10 min meditation daily',
      icon: <Flower size={25} className='text-green-900 dark:text-green-300'/>
    },
    {
      title: 'Stay Active',
      text: 'Exercise for at least 30 minutes daily',
      icon: <Footprints size={25} className='text-green-900 dark:text-green-300'/>
    }
  ]

  return (

    <div className='bg-white w-full min-h-screen p-4 md:p-8 dark:bg-[#0F172A] dark:text-gray-300'>



      <div className='bg-linear-to-br from-[#9cc6a5] to-[#bee8dc] rounded-3xl p-6 md:p-12 dark:bg-gradient-to-br dark:from-[#395c43] dark:to-[#43664D]'>

        <p className='text-[rgb(63,101,74)] dark:text-green-300 font-medium text-sm uppercase tracking-wide'>
          GOOD MORNING
        </p>

        <h1 className='text-2xl md:text-4xl font-serif mt-2 text-gray-800 font-thin dark:text-gray-200'>
          How are you feeling today?
        </h1>

        <p className='text-gray-600 mt-4 dark:text-gray-300 text-sm md:text-base'>
          Your AI health companion is here to help you understand your symptoms and guide your wellness journey.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>

          <button
            onClick={() => navigate('/check')}
            className='bg-[#395c43] w-58 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center mt-8 text-white dark:bg-[#43664D] dark:hover:bg-[#395c43] transition-colors hover:cursor-pointer'
          >
            <HeartPlus size={20} className='mr-3'/>
            Start Health Check
          </button>

          <button
            onClick={() => navigate('/check')}
            className='bg-gray-100 text-black w-49 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center mt-8 dark:bg-gray-300 dark:text-gray-700 dark:border-gray-600 dark:hover:bg-gray-200 transition-colors hover:cursor-pointer'
          >
            <Zap size={20} className='mr-3'/>
            Quick Check
          </button>

        </div>

      </div>



      <div className='mt-11'>

        <h1 className='text-2xl md:text-3xl font-serif font-thin p-1'>
          Your Health Overview
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>

          {cards.map((card, index) => (

            <div
              key={index}
              className='bg-[#e9ebe5] rounded-3xl p-5 flex items-center gap-5 dark:bg-[#1E293B] dark:text-gray-300'
            >

              {card.icon}

              <div>

                <h1 className='text-sm font-light pb-1'>
                  {card.title}
                </h1>

                <p className='text-lg font-bold'>
                  {card.value}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>



      <div className='mt-11'>

        <div className='flex justify-between items-center'>

          <h1 className='text-2xl md:text-3xl font-serif font-thin p-1'>
            Past Reports
          </h1>

          <button
            onClick={() => navigate('/reports')}
            className='text-[#43664D] dark:text-gray-300 hover:text-[#395c43] dark:hover:text-gray-100 text-sm font-medium transition-colors hover:cursor-pointer'
          >
            View all →
          </button>

        </div>

        <div className='mt-4 flex flex-col gap-3'>

          {sortedReports.length === 0 ? (

            <div className='bg-[#e9ebe5] rounded-3xl p-6 text-center text-gray-500 dark:bg-[#1E293B] dark:text-gray-300'>
              No reports found
            </div>

          ) : (

            sortedReports.slice(0, 3).map((report) => {
              const displayTitle = getReportDisplayTitle(report);
              const confidence = report.confidenceScore ?? report.confidence ?? 0;
              const urgency = report.urgencyLevel ?? report.severity ?? "General";
              const primary = report.primaryConcern ?? report.primary ?? "General health concern";
              const createdAt = report.createdAt ?? report.date ?? null;
              const responses = Array.isArray(report.responses) ? report.responses : [];
              const reportKey = report.id ?? createdAt ?? `${displayTitle}-${primary}-${responses.length}`;

              return (

              <div
                key={reportKey}
                onClick={() => navigate('/reports')}
                className='bg-[#e9ebe5] rounded-3xl p-3 flex items-center justify-between cursor-pointer dark:bg-[#1E293B] dark:text-gray-300'
              >

                <div className='flex items-center gap-4'>

                  <p className='text-sm font-bold p-3 text-red-500'>
                    {confidence}%
                  </p>

                  <div>

                    <h1>
                      {displayTitle}
                    </h1>

                    <p className='text-sm text-gray-600'>
                      {createdAt ? new Date(createdAt).toLocaleDateString() : '--'}
                    </p>

                  </div>

                </div>

                <div className='flex gap-5 items-center'>

                  <p className='bg-white px-4 py-1 rounded-xl text-sm dark:bg-gray-700 dark:text-gray-300'>
                    {urgency}
                  </p>

                  <ChevronRight />

                </div>

              </div>

              )
            })

          )}

        </div>

      </div>



      <div className='mt-11 pb-9'>

        <h1 className='text-2xl md:text-3xl font-serif font-thin p-1'>
          Daily Wellness
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>

          {wellness.map((item, index) => (

            <div
              key={index}
              className='bg-[#e9ebe5] rounded-3xl p-5 flex flex-col gap-1 dark:bg-[#1E293B] dark:text-gray-300'
            >

              {item.icon}

              <h1 className='text-lg font-serif font-thin text-gray-700 dark:text-gray-300'>
                {item.title}
              </h1>

              <p className='text-sm font-thin dark:text-gray-400'>
                {item.text}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Home
