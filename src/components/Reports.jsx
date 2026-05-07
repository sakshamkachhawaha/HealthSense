import React from 'react'
import { FolderOpen } from 'lucide-react';


const Reports = () => {
  return (
    <>
    <div className='bg-white w-full h-full p-6'>
      <div className=' bg-white flex flex-row space-evenly p-4 gap-160'>
        <div>
          <h1 className='text-black text-4xl font-serif font-thin'>Health Reports</h1>
          <p className='pt-1 text-gray-600 text-medium font-serif font-thin'>Your complete history of health assessments</p>
        </div>
        <div className='align-right bg-emerald-600 w-41 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center'>
          <button className="text-white text-medium transform transition duration-300 hover:cursor-pointer hover:scale-95" onClick={() => navigate('/check')}>
          <span className="text-white text-medium mr-2">+ </span>
           New Check
          </button>
        </div>
      </div>
      <div className='flex items-center w-full flex-col justify-center h-90 bg-[#F3F4F0] mt-4 rounded-3xl text-white text-2xl font-serif font-thin'>
        <FolderOpen size={60} className='text-gray-600'/>
        <p className='font-serif font-thin mt-4 text-gray-800'>No reports yet</p>
        <p className='font-sans font-thin mt-4 text-lg text-gray-900'>Complete your first health check to see your reports here.</p>
        <button className='bg-emerald-600 px-9 py-3 mt-4 rounded-3xl text-xl font-sans transform transition duration-300 hover:cursor-pointer hover:scale-95 '>Start Health Check</button>
      </div>
    </div>
    </>
  )
}

export default Reports
