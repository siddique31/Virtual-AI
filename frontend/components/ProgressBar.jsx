export default function ProgressBar({ progress }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Generating video...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
