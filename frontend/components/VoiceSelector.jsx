import { Mic } from 'lucide-react'

const voices = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (American Female)' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (American Female)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (American Female)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (American Male)' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (American Female)' }
]

export default function VoiceSelector({ value, onChange, disabled }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-white font-medium mb-2">
        <Mic size={18} className="text-green-400" />
        Select Voice
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-green-500 outline-none"
      >
        {voices.map(voice => (
          <option key={voice.id} value={voice.id} className="bg-gray-900">
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  )
}
