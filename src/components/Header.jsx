import React from 'react'

const Header = () => {
  return (
    <div className='hidden md:flex flex-col justify-between bg-white border-b border-gray-200 h-10 w-full dark:bg-[#0F172A] dark:border-gray-600'>
        <div className='flex flex-row justify-center items-center p-2'>
          <h1 className='text-black text-md dark:text-white '>Health Sense</h1>
        </div>
    </div>
  )
}

export default Header