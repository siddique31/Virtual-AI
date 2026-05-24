'use client'
import { useRouter } from 'next/navigation'
import { Video, LogIn, User } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <Video className="text-purple-400" />
          <span className="text-white font-bold text-xl">AI VideoGen</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-300">
                Credits: {user.credits || 0}
              </span>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Dashboard
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              <LogIn size={18} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
