'use client'
import { useRouter } from 'next/navigation'
import { Sparkles, Video, Mic } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          AI Video Generator
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Generate stunning videos with AI-powered voiceovers in seconds
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Image Generation</h3>
            <p className="text-gray-400">Create unique images from text prompts</p>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl">
            <Video className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Video Animation</h3>
            <p className="text-gray-400">Transform images into animated videos</p>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl">
            <Mic className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Voiceover</h3>
            <p className="text-gray-400">Add realistic AI voices to your videos</p>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
        >
          Start Creating Free
        </button>
      </div>
    </div>
  )
}
