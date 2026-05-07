import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Reports from './components/Reports'
import Profile from './components/Profile'
import Check from './components/Check'

const App = () => {
  const [page, setPage] = useState('home')   

  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header />

      <div className='flex flex-row h-full w-full'>
        <Sidebar page={page} setPage={setPage} /> 

        <div className="flex-1">
          {page === 'home' && <Home />}
          {page === 'check' && <Check />}
          {page === 'reports' && <Reports />}
          {page === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  )
}

export default App