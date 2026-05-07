import React, { useState } from 'react'
import { Home, Activity, FileText, User } from 'lucide-react'


const Sidebar = ({ page, setPage }) => {   
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'check', label: 'Check', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div>

      {/* Desktop Sidebar */}
      <div className='hidden md:flex flex-col bg-[#F3F4F0] w-66 h-full px-3 relative border-r border-gray-200 overflow-y-auto'>
        <div className='pt-10 px-4'>
          <h1 className='text-green-500 text-2xl font-serif font-medium'>Health Sense</h1>
          <p className='text-gray-600 mt-1 text-sm'>Welcome to Health Sense</p>
        </div>

        <div className="mt-5 flex flex-col gap-1">
        {navItems.map((item) => {
            const Icon = item.icon

            return (
            <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-3 py-4 px-5 rounded-xl text-md w-full  transition-all duration-200 
                ${page === item.id                
                  ? 'bg-[#C5ECCC] text-black font-medium'
                  : 'text-gray-900 hover:bg-gray-200'}
                `}
            >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
            </button>
            )
        })}
        </div>

        <div className='absolute bottom-0 left-0 w-full p-6 bg-[#F3F4F0] border-t border-gray-200 text-center'>
            <button className='text-gray-500 hover:text-gray-900 text-sm font-medium'>Emergency Contact</button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-[#F3F4F0] shadow-sm md:hidden flex justify-around py-2">

        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center justify-center min-w-15 py-1 transition-all duration-200
              ${page === item.id                
                ? 'text-blue-600 scale-105'
                : 'text-gray-400'}
              `}
            >
              <Icon size={22} strokeWidth={2} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}

      </div>

    </div>
  )
}

export default Sidebar