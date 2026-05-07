import React from 'react'
import { HeartPlus } from 'lucide-react';
import { Zap } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { ChartNoAxesCombined } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { Droplet } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Flower } from 'lucide-react';
import { SportShoe } from 'lucide-react';


const Home = () => {
  return (
    <div className='bg-white w-full h-full p-8'>
        <div className='bg-linear-to-br from-[#9cc6a5] to-[#bee8dc] rounded-3xl p-12'>
          <p className='text-[rgb(63,101,74)]'>GOOD MORNING</p>
          <h1 className='text-4xl font-serif mt-2 text-gray-800 font-thin'>How are you feeling today?</h1>
          <p className='text-gray-600 mt-4'>Your AI health companion is here to help you understand your symptoms and guide your wellness journey.</p>
          <div className='flex flex-row gap-4 '>
            <button className='bg-[#395c43] w-58 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center mt-8 text-white text-medium hover:cursor-pointer'><span><HeartPlus size={20} className='mr-3'/> </span>Start Health Check</button>
            <button className='bg-[#43664D] w-49 h-13 border-2 border-[#43664D] rounded-3xl flex items-center justify-center mt-8 text-white text-medium hover:cursor-pointer'><span><Zap  size={20} className='mr-3'/> </span>Quick Check</button>
          </div>
        </div>

        <div className='mt-11'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-serif font-thin p-1'>Your Health Overview</h1>
          </div>
          <div className='flex flex-row gap-4'>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 flex flex-row items-center gap-5 hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <ChartNoAxesCombined size={45} className='bg-green-200 p-2 rounded-2xl'/>
              <div className='flex flex-col'>
                <h1 className='text-sm font-light pb-1'>Last Score</h1>
                <p className='text-lg text-black font-bold'>98%</p>
              </div>
            </div>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 flex flex-row items-center gap-5 hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <CalendarDays size={45} className='bg-olive-300 p-2 rounded-2xl'/>
              <div className='flex flex-col'>
                <h1 className='text-sm font-light pb-1'>Last Check</h1>
                <p className='text-lg text-black font-bold'>May 7, 2026</p>
              </div>
            </div>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 flex flex-row items-center gap-5 hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <ClipboardList size={45} className='bg-slate-300 p-2 rounded-2xl'/>
              <div className='flex flex-col'>
                <h1 className='text-sm font-light pb-1'>Total Checks</h1>
                <p className='text-lg text-black font-bold'>1</p>
              </div>
            </div>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 flex flex-row items-center gap-5 hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <TriangleAlert size={45} className='bg-red-200 p-2 rounded-2xl'/>
              <div className='flex flex-col'>
                <h1 className='text-sm font-light pb-1'>Status</h1>
                <p className='text-lg text-black font-bold'>High Concern</p>
              </div>
            </div>
          </div>
      
        </div>




        <div className='mt-11'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-serif font-thin p-1'>Past Reports</h1>
            <button className='text-[#43664D] hover:text-[#395c43] cursor-pointer p-2 mr-6 text-sm'>View all → </button>
          </div>
          <div className='bg-[#e9ebe5] rounded-3xl p-3 mt-4 flex items-center justify-between hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
            <div className='flex items-center gap-4'>
              <p className='text-sm font-bold p-3 text-red-500'>95%</p>
              <div className='flex flex-col gap-1'>
                <h1>Fever</h1>
                <p className='text-sm text-gray-600'>Date</p>
              </div>
            </div>
            <div className='flex gap-8 items-center'>
              <p className='text-sm text-gray-600 bg-red-200 px-4 py-1 rounded-xl'>High</p> 
              <ChevronRight />
            </div>
          </div>
        </div>



        <div className='mt-11 pb-9'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-serif font-thin p-1'>Daily Wellness</h1>
          </div>
          <div className='flex flex-row gap-4 '>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 gap-1 flex flex-col hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <Droplet size={25} className='text-green-900'/>
              <h1 className='text-lg font-serif font-thin text-gray-700'>Stay Hydrated</h1>
              <p className='text-sm font-sans-serif font-thin'>Drink 8 glasses of water daily</p>
            </div>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 gap-1 flex flex-col hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <Moon size={25} className='text-green-900'/>
              <h1 className='text-lg font-serif font-thin text-gray-700'>Quality Sleep</h1>
              <p className='text-sm font-sans-serif font-thin'>Aim for 7-9 hours each night</p>
            </div>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 gap-1 flex flex-col hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <Flower size={25} className='text-green-900'/>
              <h1 className='text-lg font-serif font-thin text-gray-700'>Mindfulness</h1>
              <p className='text-sm font-sans-serif font-thin'>10 min meditation daily</p>
            </div>
            <div className='bg-[#e9ebe5] w-70 rounded-3xl p-5 mt-4 gap-1 flex flex-col hover:border duration-700 transition-all border-[#43664D] cursor-pointer'>
              <SportShoe size={25} className='text-green-900'/>
              <h1 className='text-lg font-serif font-thin text-gray-700'>Stay Active</h1>
              <p className='text-sm font-sans-serif font-thin'>Exercise for at least 30 minutes daily</p>
            </div>
          </div>
      
        </div>







    </div>
  )
}

export default Home