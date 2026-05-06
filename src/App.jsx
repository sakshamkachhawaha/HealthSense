import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Reports from './components/Reports'
import Profile from './components/Profile'



const App = () => {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header />
      <div className='flex flex-row h-full w-full'>
        <Sidebar />
        <Profile />
      </div>
    </div>
  )
}

export default App