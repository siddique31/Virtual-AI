'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VideoGenerator from '@/components/VideoGenerator'
import { LogOut, Video, History, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [generations, setGenerations] = useState([])
  const [activeTab, setActiveTab] = useState('create')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    fetchUserProfile()
    fetchGenerations()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Failed to fetch profile')
    }
  }

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get('/generate')
      setGenerations(data.generations || [])
    } catch (error) {
      console.error('Failed to fetch generations')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
    toast.success('Logged out')
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="text-green-400" size={16} />
      case 'failed': return <XCircle className="text-red-400" size={16} />
      case 'processing': return <Clock className="text-yellow-400 animate-spin" size={16} />
      default: return <Clock className="text-gray-400" size={16} />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Video className="text-purple-400" size={28} />
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome, {user?.name}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
              <CreditCard size={16} className="text-purple-400" />
              <span className="text-purple-300 font-semibold">{user?.credits || 0} Credits</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            <Video size={18} />
            Create New
          </button>
          <button
            onClick={() => {
              setActiveTab('history')
              fetchGenerations()
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            <History size={18} />
            History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' ? (
          <VideoGenerator onGenerationComplete={fetchGenerations} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.length === 0 ? (
              <div className="col-span-full text-center py-20 glass rounded-2xl">
                <History size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No Videos Yet</h3>
                <p className="text-gray-400 mb-6">Start creating your first AI video!</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
                >
                  Create Video
                </button>
              </div>
            ) : (
              generations.map((gen) => (
                <div key={gen._id} className="glass rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-800">
                    {gen.finalVideoUrl ? (
                      <video src={gen.finalVideoUrl} controls className="w-full h-full object-cover" />
                    ) : gen.imageUrl ? (
                      <img src={gen.imageUrl} alt={gen.prompt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">
                          {gen.status === 'processing' ? 'Generating...' : 'Queued'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-white text-sm mb-2 truncate">{gen.prompt}</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(gen.status)}
                      <span className="text-xs text-gray-400 capitalize">{gen.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
