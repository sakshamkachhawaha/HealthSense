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
    <div className='flex flex-col h-screen w-screen overflow-hidden'>
      <Header />

      <div className='flex-1 flex flex-row overflow-hidden'>
        <Sidebar page={page} setPage={setPage} /> 

        <div className="flex-1 overflow-y-auto min-h-0">
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