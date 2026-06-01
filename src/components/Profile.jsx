import { useEffect, useState, useMemo} from 'react'
import { UserRound } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Bell } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { Gavel } from 'lucide-react';

function getStoredHealthReports() {
  try {
    const aiReports = JSON.parse(localStorage.getItem("healthsense_ai_reports") || "[]");
    const oldReports = JSON.parse(localStorage.getItem("healthsense_reports") || "[]");

    if (Array.isArray(aiReports) && aiReports.length > 0) {
      return aiReports;
    }

    if (Array.isArray(oldReports) && oldReports.length > 0) {
      return oldReports;
    }

    return [];
  } catch (error) {
    console.error("Failed to read health reports from localStorage:", error);
    return [];
  }
}

function getStoredProfile() {
  const defaultProfile = {
    name: 'Set Your Username',
    email: 'Set Your Email'
  };

  try {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  } catch (error) {
    console.error("Failed to read profile from localStorage:", error);
    return defaultProfile;
  }
}

const Profile = ({ darkMode, setDarkMode }) => {


  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState(getStoredProfile)

  const [tempProfile, setTempProfile] = useState(getStoredProfile)


  const handleEdit = () => {
    setTempProfile(profile)
    setIsEditing(true)
  }



  const handleSave = () => {
    setProfile(tempProfile)

    localStorage.setItem(
      'userProfile',
      JSON.stringify(tempProfile)
    )

    setIsEditing(false)
  }


  const handleCancel = () => {
    setTempProfile(profile)
    setIsEditing(false)
  }



  const loadReports = () => {
    return getStoredHealthReports()
  }

  const [reports, setReports] = useState(loadReports())

  useEffect(() => {

    const refresh = () => setReports(loadReports())

    window.addEventListener('focus', refresh)

    return () => window.removeEventListener('focus', refresh)

  }, [])

  const sortedReports = useMemo(() => reports, [reports])

  const latestReport = sortedReports[0]
  const latestConfidence = latestReport?.confidenceScore ?? latestReport?.confidence ?? 0
  const lowConcernCount = reports.filter((report) => {
    const severity = report.urgencyLevel ?? report.severity ?? "General";
    return severity === "Low" || severity === "Low Concern";
  }).length


  return (
    <div className='bg-white w-full h-full dark:bg-[#0F172A]'>
      <div className='px-4 md:px-8 lg:ml-50 lg:mr-50 p-5 flex flex-col gap-6'>
        <h1 className='text-black text-2xl md:text-4xl font-serif dark:text-gray-200'>Profile & Settings</h1>

        <div className='bg-[#F3F4F0] p-6 md:p-10 rounded-3xl dark:bg-[#1E293B]'>
          <div className='flex flex-col sm:flex-row gap-5 items-center sm:items-start'>

            <div className='bg-linear-to-br from-[#84a98c] to-[#bee8dc] p-4 rounded-full'>
              <UserRound size={50} color='Black' />
            </div>



            {!isEditing && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-black text-2xl font-serif dark:text-gray-300'>
                  {profile.name}
                </h2>

                <p className='text-black text-sm dark:text-gray-300'>
                  {profile.email}
                </p>

                <div>
                  <button
                    onClick={handleEdit}
                    className='text-green-900 hover:cursor-pointer py-1 rounded-md text-sm dark:text-green-400'
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}



            {isEditing && (
              <div className='flex flex-col gap-3 w-full'>

                <input
                  type="text"
                  placeholder='Enter Username'
                  value={tempProfile.name}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      name: e.target.value
                    })
                  }
                  className='bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-black dark:text-white outline-none'
                />

                <input
                  type="email"
                  placeholder='Enter Email'
                  value={tempProfile.email}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      email: e.target.value
                    })
                  }
                  className='bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-black dark:text-white outline-none'
                />

                <div className='flex gap-3 mt-2'>

                  <button
                    onClick={handleSave}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl'
                  >
                    Save
                  </button>

                  <button
                    onClick={handleCancel}
                    className='bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl dark:bg-gray-700 dark:text-white'
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>


        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='bg-[#F3F4F0] pt-8 pb-6 rounded-3xl w-full flex flex-col items-center gap-4 dark:bg-[#1E293B]'>
            <span className='text-black text-4xl dark:text-gray-300'>{reports.length}</span>
            <p className='text-black text-sm font-serif dark:text-gray-300'>Total Checks</p>
          </div>
          <div className='bg-[#F3F4F0] pt-8 pb-6 rounded-3xl w-full flex flex-col items-center gap-4 dark:bg-[#1E293B]'>
            <span className='text-black text-4xl dark:text-gray-300'>{latestReport ? `${latestConfidence}%` : '--'}</span>
            <p className='text-black text-sm font-serif dark:text-gray-300'>Avg Score</p>
          </div>
          <div className='bg-[#F3F4F0] pt-8 pb-6 rounded-3xl w-full flex flex-col items-center gap-4 dark:bg-[#1E293B]'>
            <span className='text-black text-4xl dark:text-gray-300'>{lowConcernCount}</span>
            <p className='text-black text-sm font-serif dark:text-gray-300'>Low Concern</p>
          </div>
        </div>

        <div className='bg-[#F3F4F0] rounded-3xl p-4 dark:bg-[#1E293B]'>
          <h2 className='text-black text-2xl font-serif mb-4 border-b p-2 border-[#edeeea] dark:border-gray-600 dark:text-gray-300'>Settings</h2>

          <div className='flex items-center gap-4 p-2 mb-4 border-b border-[#edeeea] dark:border-gray-600'>
            <Moon size={25} className='dark:text-gray-300'/>
            <div className='flex flex-col gap-0'>
              <h1 className='text-black text-medium dark:text-gray-300'>Dark Mode</h1>
              <p className='text-sm dark:text-gray-300'>Switch between light and dark theme</p>
            </div>

            <div className='flex flex-row gap-2 items-center ml-auto'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />

                <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>

                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5">
                </div>
              </label>
            </div>
          </div>

          <div className='flex items-center gap-4 p-2 mb-4 border-b border-[#edeeea] dark:border-gray-600'>
            <Bell size={25} className='dark:text-gray-300'/>
            <div className='flex flex-col gap-0'>
              <h1 className='text-black text-medium dark:text-gray-300'>Daily Reminders</h1>
              <p className='text-sm dark:text-gray-300'>Get notified for daily health checks</p>
            </div>

            <div className='flex flex-row gap-2 items-center ml-auto'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />

                <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>

                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5">
                </div>
              </label>
            </div>
          </div>

          <div className='flex items-center gap-4 p-2 mb-4 border-b border-[#edeeea] dark:border-gray-600'>
            <LockKeyhole size={25} className='dark:text-gray-300'/>
            <div className='flex flex-col gap-0'>
              <h1 className='text-black text-medium dark:text-gray-300'>Privacy</h1>
              <p className='text-sm dark:text-gray-300'>Your data stays on your device</p>
            </div>

            <div className='flex flex-row gap-2 items-center ml-auto'>
              <ShieldCheck className='dark:text-gray-300'/>
            </div>
          </div>

        </div>

        <div className='bg-[#F3F4F0] p-4 rounded-2xl flex flex-row gap-4 items-center dark:bg-[#1E293B]'>
          <Gavel size={30} className='dark:text-gray-300'/>
          <p className='text-sm dark:text-gray-300'>Health Sense is an AI-powered wellness tool and does not provide medical diagnoses. Always consult a qualified healthcare professional for medical advice.</p>
        </div>

      </div>
    </div>
  )
}

export default Profile
