require('dotenv').config()
const Queue = require('bull')
const Replicate = require('replicate')
const mongoose = require('mongoose')
const Generation = require('../models/Generation')
const User = require('../models/User')
const { generateVoice } = require('../utils/elevenLabsClient')
const { mergeVideoAndAudio } = require('../utils/ffmpegProcessor')
const { uploadToS3 } = require('../utils/s3Uploader')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('📦 Worker: MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

// Create queue
const videoGenerationQueue = new Queue('video-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
})

// Process jobs
videoGenerationQueue.process(async (job) => {
  const { generationId, userId, prompt, voiceText, voiceId } = job.data

  try {
    console.log(`🎬 Processing generation ${generationId}`)

    // Step 1: Generate Image
    await Generation.findByIdAndUpdate(generationId, { status: 'processing', progress: 10 })
    console.log('🖼️ Generating image...')

    const imageOutput = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: "blurry, bad quality, distorted",
          width: 1024,
          height: 576
        }
      }
    )

    const imageUrl = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput
    await Generation.findByIdAndUpdate(generationId, { imageUrl, progress: 30 })
    console.log('✅ Image generated')

    // Step 2: Generate Video
    await Generation.findByIdAndUpdate(generationId, { progress: 35 })
    console.log('🎥 Generating video...')

    const videoOutput = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          cond_aug: 0.02,
          decoding_t: 7,
          input_image: imageUrl,
          video_length: "14_frames_with_svd",
          sizing_strategy: "maintain_aspect_ratio",
          frames_per_second: 6
        }
      }
    )

    const videoUrl = videoOutput
    await Generation.findByIdAndUpdate(generationId, { videoUrl, progress: 60 })
    console.log('✅ Video generated')

    // Step 3: Generate Voice
    await Generation.findByIdAndUpdate(generationId, { progress: 65 })
    console.log('🎙️ Generating voice...')

    const voiceUrl = await generateVoice(voiceText, voiceId)
    await Generation.findByIdAndUpdate(generationId, { voiceUrl, progress: 80 })
    console.log('✅ Voice generated')

    // Step 4: Merge Video + Audio
    await Generation.findByIdAndUpdate(generationId, { progress: 85 })
    console.log('🔧 Merging...')

    const mergedBuffer = await mergeVideoAndAudio(videoUrl, voiceUrl)
    console.log('✅ Merged')

    // Step 5: Upload to S3
    await Generation.findByIdAndUpdate(generationId, { progress: 90 })
    console.log('☁️ Uploading...')

    const finalVideoUrl = await uploadToS3(
      mergedBuffer,
      'video/mp4',
      `generations/${userId}/${generationId}.mp4`
    )
    console.log('✅ Uploaded')

    // Complete
    await Generation.findByIdAndUpdate(generationId, {
      finalVideoUrl,
      status: 'completed',
      progress: 100,
      completedAt: new Date()
    })

    console.log(`✅ Generation ${generationId} completed!`)
    return { finalVideoUrl }

  } catch (error) {
    console.error(`❌ Generation ${generationId} failed:`, error)

    // Refund credit
    await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } })

    await Generation.findByIdAndUpdate(generationId, {
      status: 'failed',
      error: error.message
    })

    throw error
  }
})

console.log('👷 Worker started, waiting for jobs...')

module.exports = { videoGenerationQueue }
