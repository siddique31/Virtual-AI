const mongoose = require('mongoose')

const generationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobId: String,
  prompt: {
    type: String,
    required: true
  },
  voiceText: {
    type: String,
    required: true
  },
  voiceId: {
    type: String,
    default: '21m00Tcm4TlvDq8ikWAM'
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued'
  },
  progress: {
    type: Number,
    default: 0
  },
  imageUrl: String,
  videoUrl: String,
  voiceUrl: String,
  finalVideoUrl: String,
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
})

generationSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Generation', generationSchema)
