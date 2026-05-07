import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Reports from './components/Reports'
import Profile from './components/Profile'
import Check from './components/Check'

const RouterApp = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [page, setPage] = useState('home')

  useEffect(() => {
    const path = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '')
    setPage(path)
  }, [location.pathname])

  const handleSetPage = (p) => {
    const path = p === 'home' ? '/' : `/${p}`
    if (location.pathname !== path) navigate(path)
    setPage(p)
  }
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className='flex flex-col h-screen w-screen overflow-hidden'>
      <Header />

      <div className='flex-1 flex flex-row overflow-hidden'>
        <Sidebar page={page} setPage={handleSetPage} />

        <div className="flex-1 overflow-y-auto min-h-0 dark:bg-[#0F172A]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<Check />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <RouterApp />
    </Router>
  )
}

export default App
