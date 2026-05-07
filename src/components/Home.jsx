import React, { useState, useMemo, useEffect } from 'react'
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

const Home = () => {

  const navigate = useNavigate()

  const loadReports = () => {
    try {
      return JSON.parse(localStorage.getItem('healthsense_reports')) || []
    } catch {
      return []
    }
  }

  const [reports, setReports] = useState(loadReports())

  useEffect(() => {

    const refresh = () => setReports(loadReports())

    window.addEventListener('focus', refresh)

    return () => window.removeEventListener('focus', refresh)

  }, [])

  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [reports])

  const latestReport = sortedReports[0]

  const cards = [
    {
      title: 'Last Score',
      value: latestReport ? `${latestReport.confidence}%` : '--',
      icon: <ChartNoAxesCombined size={45} className='bg-green-200 p-2 rounded-2xl'/>
    },
    {
      title: 'Last Check',
      value: latestReport ? new Date(latestReport.createdAt).toLocaleDateString() : '--',
      icon: <CalendarDays size={45} className='bg-yellow-200 p-2 rounded-2xl'/>
    },
    {
      title: 'Total Checks',
      value: reports.length,
      icon: <ClipboardList size={45} className='bg-slate-300 p-2 rounded-2xl'/>
    },
    {
      title: 'Status',
      value:
        reports.some(r => r.severity === 'High Concern')
          ? 'High Concern'
          : reports.some(r => r.severity === 'Moderate Concern')
          ? 'Moderate'
          : 'Good',
      icon: <TriangleAlert size={45} className='bg-red-200 p-2 rounded-2xl'/>
    }
  ]

  const wellness = [
    {
      title: 'Stay Hydrated',
      text: 'Drink 8 glasses of water daily',
      icon: <Droplet size={25} className='text-green-900'/>
    },
    {
      title: 'Quality Sleep',
      text: 'Aim for 7-9 hours each night',
      icon: <Moon size={25} className='text-green-900'/>
    },
    {
      title: 'Mindfulness',
      text: '10 min meditation daily',
      icon: <Flower size={25} className='text-green-900'/>
    },
    {
      title: 'Stay Active',
      text: 'Exercise for at least 30 minutes daily',
      icon: <Footprints size={25} className='text-green-900'/>
    }
  ]

  return (

    <div className='bg-white w-full min-h-screen p-8'>



      <div className='bg-linear-to-br from-[#9cc6a5] to-[#bee8dc] rounded-3xl p-12'>

        <p className='text-[rgb(63,101,74)]'>
          GOOD MORNING
        </p>

        <h1 className='text-4xl font-serif mt-2 text-gray-800 font-thin'>
          How are you feeling today?
        </h1>

        <p className='text-gray-600 mt-4'>
          Your AI health companion is here to help you understand your symptoms and guide your wellness journey.
        </p>

        <div className='flex gap-4'>

          <button
            onClick={() => navigate('/check')}
            className='bg-[#395c43] w-58 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center mt-8 text-white'
          >
            <HeartPlus size={20} className='mr-3'/>
            Start Health Check
          </button>

          <button
            onClick={() => navigate('/check')}
            className='bg-gray-100 text-black w-49 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center mt-8 '
          >
            <Zap size={20} className='mr-3'/>
            Quick Check
          </button>

        </div>

      </div>



      <div className='mt-11'>

        <h1 className='text-3xl font-serif font-thin p-1'>
          Your Health Overview
        </h1>

        <div className='flex flex-wrap gap-4 mt-4'>

          {cards.map((card, index) => (

            <div
              key={index}
              className='bg-[#e9ebe5] w-70 rounded-3xl p-5 flex items-center gap-5'
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

          <h1 className='text-3xl font-serif font-thin p-1'>
            Past Reports
          </h1>

          <button
            onClick={() => navigate('/reports')}
            className='text-[#43664D]'
          >
            View all →
          </button>

        </div>

        <div className='mt-4 flex flex-col gap-3'>

          {sortedReports.length === 0 ? (

            <div className='bg-[#e9ebe5] rounded-3xl p-6 text-center text-gray-500'>
              No reports found
            </div>

          ) : (

            sortedReports.slice(0, 3).map((report) => (

              <div
                key={report.id}
                onClick={() => navigate('/reports')}
                className='bg-[#e9ebe5] rounded-3xl p-3 flex items-center justify-between cursor-pointer'
              >

                <div className='flex items-center gap-4'>

                  <p className='text-sm font-bold p-3 text-red-500'>
                    {report.confidence}%
                  </p>

                  <div>

                    <h1>
                      {report.insights?.disease}
                    </h1>

                    <p className='text-sm text-gray-600'>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className='flex gap-5 items-center'>

                  <p className='bg-white px-4 py-1 rounded-xl text-sm'>
                    {report.severity}
                  </p>

                  <ChevronRight />

                </div>

              </div>

            ))

          )}

        </div>

      </div>



      <div className='mt-11 pb-9'>

        <h1 className='text-3xl font-serif font-thin p-1'>
          Daily Wellness
        </h1>

        <div className='flex flex-wrap gap-4 mt-4'>

          {wellness.map((item, index) => (

            <div
              key={index}
              className='bg-[#e9ebe5] w-70 rounded-3xl p-5 flex flex-col gap-1'
            >

              {item.icon}

              <h1 className='text-lg font-serif font-thin text-gray-700'>
                {item.title}
              </h1>

              <p className='text-sm font-thin'>
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