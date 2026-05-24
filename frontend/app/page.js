'use client'
import { useRouter } from 'next/navigation'
import { Sparkles, Video, Mic, ArrowRight, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              AI Video Generator
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Create stunning AI-powered videos with realistic voiceovers in seconds.
            Text to Image to Video - All in one place!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:scale-105 transform transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="group p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105">
            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Image Generation</h3>
            <p className="text-gray-400">
              Transform text prompts into stunning, high-quality images using advanced AI models.
            </p>
          </div>

          <div className="group p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all hover:scale-105">
            <div className="w-16 h-16 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Video Animation</h3>
            <p className="text-gray-400">
              Convert static images into dynamic, animated videos with smooth motion effects.
            </p>
          </div>

          <div className="group p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all hover:scale-105">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Mic className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Voiceover</h3>
            <p className="text-gray-400">
              Add ultra-realistic AI-generated voices in multiple languages and accents.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Write Prompt', desc: 'Describe your video', icon: '✍️' },
              { step: '2', title: 'AI Generates', desc: 'Image & video created', icon: '🤖' },
              { step: '3', title: 'Add Voice', desc: 'Type narration text', icon: '🎙️' },
              { step: '4', title: 'Download', desc: 'Get final video', icon: '⬇️' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Amazing Videos?</h2>
          <p className="text-gray-300 mb-8 text-lg">Start generating AI videos today. No credit card required!</p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:scale-105 transform transition-all inline-flex items-center gap-2"
          >
            <Zap size={20} />
            Start Creating Free
          </button>
        </div>
      </div>
    </div>
  )
}
