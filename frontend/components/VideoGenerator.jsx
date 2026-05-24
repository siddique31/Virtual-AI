'use client'
import { useState } from 'react'
import { Loader2, Download, Image, Video, Mic, RefreshCw } from 'lucide-react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

export default function VideoGenerator({ onGenerationComplete }) {
  const [prompt, setPrompt] = useState('')
  const [voiceText, setVoiceText] = useState('')
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle')
  const [imageUrl, setImageUrl] = useState(null)
  const [finalVideoUrl, setFinalVideoUrl] = useState(null)

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (American Female)' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (American Female)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (American Female)' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (American Male)' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (American Female)' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (American Male)' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (American Male)' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (American Male)' }
  ]

  const handleGenerate = async () => {
    if (!prompt || !voiceText) {
      toast.error('Please fill in all fields')
      return
    }

    setStatus('generating')
    setProgress(0)
    setImageUrl(null)
    setFinalVideoUrl(null)

    try {
      const { data } = await api.post('/generate', { prompt, voiceText, voiceId })
      toast.success('Generation started! This may take 2-3 minutes.')
      pollProgress(data.generationId)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start generation')
      setStatus('idle')
    }
  }

  const pollProgress = async (genId) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/generate/${genId}`)
        const gen = data.generation

        setProgress(gen.progress || 0)
        if (gen.imageUrl) setImageUrl(gen.imageUrl)
        
        if (gen.finalVideoUrl) {
          setFinalVideoUrl(gen.finalVideoUrl)
          setStatus('completed')
          clearInterval(interval)
          toast.success('Video generated successfully! 🎉')
          if (onGenerationComplete) onGenerationComplete()
        }

        if (gen.status === 'failed') {
          setStatus('failed')
          clearInterval(interval)
          toast.error('Generation failed')
        }
      } catch (error) {
        clearInterval(interval)
        setStatus('failed')
      }
    }, 3000)
  }

  const handleDownload = async () => {
    if (!finalVideoUrl) return
    try {
      const response = await fetch(finalVideoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-video-${Date.now()}.mp4`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-white font-medium mb-2">
            <Image size={18} className="text-purple-400" />
            Image Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 outline-none resize-none"
            rows="4"
            placeholder="A futuristic city with flying cars and neon lights at sunset..."
            disabled={status === 'generating'}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white font-medium mb-2">
            <Mic size={18} className="text-blue-400" />
            Voiceover Text
          </label>
          <textarea
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none resize-none"
            rows="3"
            placeholder="Welcome to the future of technology..."
            disabled={status === 'generating'}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white font-medium mb-2">
            <Mic size={18} className="text-green-400" />
            Select Voice
          </label>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-green-500 outline-none"
            disabled={status === 'generating'}
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
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-lg"
        >
          {status === 'generating' ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating... {progress}%
            </>
          ) : status === 'failed' ? (
            <>
              <RefreshCw size={20} />
              Try Again
            </>
          ) : (
            <>
              <Video size={20} />
              Generate Video (1 Credit)
            </>
          )}
        </button>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        {progress > 0 && status === 'generating' && (
          <div className="glass rounded-xl p-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-white mb-3 flex items-center gap-2">
              <Image size={18} className="text-purple-400" />
              Generated Image
            </h3>
            <img src={imageUrl} alt="Generated" className="rounded-lg w-full" />
          </div>
        )}

        {finalVideoUrl && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-white mb-3 flex items-center gap-2">
              <Video size={18} className="text-pink-400" />
              Final Video
            </h3>
            <video controls className="rounded-lg w-full" src={finalVideoUrl} />
            <button
              onClick={handleDownload}
              className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download Video
            </button>
          </div>
        )}

        {status === 'idle' && !imageUrl && !finalVideoUrl && (
          <div className="glass rounded-xl p-12 text-center">
            <Video size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your Video Will Appear Here</h3>
            <p className="text-gray-400">Fill in the form and click generate</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="glass rounded-xl p-8 text-center border-red-500/30">
            <p className="text-red-400 text-4xl mb-4">😕</p>
            <h3 className="text-xl font-semibold text-white mb-2">Generation Failed</h3>
            <p className="text-gray-400">Please try again. Credit refunded.</p>
          </div>
        )}
      </div>
    </div>
  )
}
