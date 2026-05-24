'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import { Download, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [voiceText, setVoiceText] = useState('')
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle')
  const [imageUrl, setImageUrl] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [finalVideoUrl, setFinalVideoUrl] = useState(null)

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female)' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Male)' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Female)' },
  ]

  useEffect(() => {
    const socket = io(API_URL)
    
    socket.on('progress', (data) => {
      setProgress(data.progress)
      setStatus(data.status)
    })
    
    socket.on('generation-complete', (data) => {
      setFinalVideoUrl(data.finalVideoUrl)
      setStatus('completed')
      toast.success('Video generated successfully!')
    })
    
    return () => socket.disconnect()
  }, [])

  const handleGenerate = async () => {
    if (!prompt || !voiceText) {
      toast.error('Please fill all fields')
      return
    }
    
    setStatus('generating')
    setProgress(0)
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/generate`,
        { prompt, voiceText, voiceId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const { jobId } = response.data
      
      // Poll for progress
      const interval = setInterval(async () => {
        const statusRes = await axios.get(`${API_URL}/api/generate/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        const { status: jobStatus, imageUrl, videoUrl, finalVideoUrl } = statusRes.data
        
        if (imageUrl) setImageUrl(imageUrl)
        if (videoUrl) setVideoUrl(videoUrl)
        if (finalVideoUrl) {
          setFinalVideoUrl(finalVideoUrl)
          setStatus('completed')
          clearInterval(interval)
        }
        
        if (jobStatus === 'failed') {
          setStatus('failed')
          clearInterval(interval)
          toast.error('Generation failed')
        }
      }, 2000)
      
    } catch (error) {
      toast.error('Something went wrong')
      setStatus('failed')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">Image Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-purple-500/30 focus:border-purple-500 outline-none"
              rows="3"
              placeholder="A cinematic shot of a robot walking through a neon-lit city..."
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Voiceover Text</label>
            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-blue-500/30 focus:border-blue-500 outline-none"
              rows="3"
              placeholder="Welcome to the future of technology..."
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Select Voice</label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-blue-500/30 focus:border-blue-500 outline-none"
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id} className="bg-gray-900">
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={status === 'generating'}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {status === 'generating' ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" />
                Generating... {progress}%
              </span>
            ) : 'Generate Video'}
          </button>
        </div>
        
        {/* Preview Section */}
        <div className="space-y-6">
          {progress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {imageUrl && (
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-white mb-2">Generated Image</h3>
              <img
                src={imageUrl}
                alt="Generated"
                className="rounded-lg w-full"
              />
            </div>
          )}
          
          {finalVideoUrl && (
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-white mb-2">Final Video with Voiceover</h3>
              <video
                controls
                className="rounded-lg w-full"
                src={finalVideoUrl}
              />
              <a
                href={finalVideoUrl}
                download
                className="mt-3 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={20} />
                Download Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
