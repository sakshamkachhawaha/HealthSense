import React from 'react'
import { UserRound } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Bell } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { Gavel } from 'lucide-react';

const Profile = () => {
  return (
    <div className='bg-gray-50 w-full h-full '>
      <div className='ml-50 mr-50 mt-5 p-5 flex flex-col gap-6'>
        <h1 className='text-black text-4xl font-serif '>Profile & Settings</h1>

        <div className='bg-[#F3F4F0] p-10 rounded-3xl'>
          <div className='flex flex-row gap-5 items-center'>
            <div className='bg-linear-to-br from-[#84a98c] to-[#bee8dc] p-4 rounded-full'>
              <UserRound size={50} color='Black' />
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-black text-2xl font-serif'>Set Your Username</h2>
              <p className='text-black text-sm'>Set Your Email</p>
              <div>
                <button className='text-green-900 hover:cursor-pointer py-1 rounded-md text-sm'>Edit Profile</button>
              </div>
            </div>
          </div>
        </div>


        <div className='flex flex-row gap-4'>
          <div className='bg-[#F3F4F0] pt-8 pb-6 rounded-3xl w-full flex flex-col items-center gap-4'>
            <span className='text-black text-4xl '>0</span>
            <p className='text-black text-sm font-serif'>Total Checks</p>
          </div>
          <div className='bg-[#F3F4F0] pt-8 pb-6 rounded-3xl w-full flex flex-col items-center gap-4'>
            <span className='text-black text-4xl '>0%</span>
            <p className='text-black text-sm font-serif'>Avg Score</p>
          </div>
          <div className='bg-[#F3F4F0] pt-8 pb-6 rounded-3xl w-full flex flex-col items-center gap-4'>
            <span className='text-black text-4xl'>0</span>
            <p className='text-black text-sm font-serif'>Low Concern</p>
          </div>
        </div>

        <div className='bg-[#F3F4F0] rounded-3xl p-4'>
          <h2 className='text-black text-2xl font-serif mb-4 border-b p-2 border-[#edeeea] '>Settings</h2>
          <div className='flex items-center gap-4 p-2 mb-4 border-b border-[#edeeea]'>
            <Moon size={25} />
            <div className='flex flex-col gap-0'>
              <h1 className='text-black text-medium'>Dark Mode</h1>
              <p className='text-sm'>Switch between light and dark theme</p>
            </div>
            <div className='flex flex-row gap-2 items-center ml-auto'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />

                <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>

                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md 
                  transition-transform peer-checked:translate-x-5">
                </div>
              </label>
            </div>
          </div>

          <div className='flex items-center gap-4 p-2 mb-4 border-b border-[#edeeea]'>
            <Bell size={25} />
            <div className='flex flex-col gap-0'>
              <h1 className='text-black text-medium'>Daily Reminders</h1>
              <p className='text-sm'>Get notified for daily health checks</p>
            </div>
            <div className='flex flex-row gap-2 items-center ml-auto'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />

                <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>

                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md 
                  transition-transform peer-checked:translate-x-5">
                </div>
              </label>
            </div>
          </div>

          <div className='flex items-center gap-4 p-2 mb-4 border-b border-[#edeeea]'>
            <LockKeyhole size={25} />
            <div className='flex flex-col gap-0'>
              <h1 className='text-black text-medium'>Privacy</h1>
              <p className='text-sm'>Your data stays on your device</p>
            </div>
            <div className='flex flex-row gap-2 items-center ml-auto'>
              <ShieldCheck />
            </div>
          </div>

        </div>

        <div className='bg-[#F3F4F0] p-4 rounded-2xl flex flex-row gap-4 items-center'>
          <Gavel size={30} />
          <p className='text-sm'>ZenHealth is an AI-powered wellness tool and does not provide medical diagnoses. Always consult a qualified healthcare professional for medical advice.</p>
        </div>
      </div>
    </div>
  )
}


export default Profile