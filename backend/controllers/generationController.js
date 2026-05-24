const Queue = require('bull')
const Generation = require('../models/Generation')
const User = require('../models/User')

// Initialize queue
const videoGenerationQueue = new Queue('video-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
})

// Create generation
exports.createGeneration = async (req, res) => {
  try {
    const { prompt, voiceText, voiceId } = req.body
    const userId = req.user.id

    if (!prompt || !voiceText) {
      return res.status(400).json({ success: false, error: 'Please provide prompt and voice text' })
    }

    // Check credits
    const user = await User.findById(userId)
    if (user.credits <= 0) {
      return res.status(402).json({ success: false, error: 'Insufficient credits' })
    }

    // Deduct credit
    user.credits -= 1
    user.totalGenerations += 1
    await user.save()

    // Create generation record
    const generation = await Generation.create({
      userId,
      prompt,
      voiceText,
      voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM',
      status: 'queued'
    })

    // Add to queue
    const job = await videoGenerationQueue.add({
      generationId: generation._id.toString(),
      userId,
      prompt,
      voiceText,
      voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM'
    })

    generation.jobId = job.id
    await generation.save()

    res.status(201).json({
      success: true,
      generationId: generation._id,
      jobId: job.id,
      remainingCredits: user.credits
    })
  } catch (error) {
    console.error('Create generation error:', error)
    res.status(500).json({ success: false, error: 'Failed to start generation' })
  }
}

// Get generation status
exports.getGenerationStatus = async (req, res) => {
  try {
    const generation = await Generation.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!generation) {
      return res.status(404).json({ success: false, error: 'Generation not found' })
    }

    res.json({
      success: true,
      generation: {
        id: generation._id,
        jobId: generation.jobId,
        prompt: generation.prompt,
        status: generation.status,
        progress: generation.progress,
        imageUrl: generation.imageUrl,
        videoUrl: generation.videoUrl,
        voiceUrl: generation.voiceUrl,
        finalVideoUrl: generation.finalVideoUrl,
        error: generation.error,
        createdAt: generation.createdAt,
        completedAt: generation.completedAt
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch status' })
  }
}

// Get user generations
exports.getUserGenerations = async (req, res) => {
  try {
    const generations = await Generation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ success: true, generations })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch generations' })
  }
}
