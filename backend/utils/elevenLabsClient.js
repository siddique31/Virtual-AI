const axios = require('axios')
const { uploadToS3 } = require('./s3Uploader')

async function generateVoice(text, voiceId = '21m00Tcm4TlvDq8ikWAM') {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      data: {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    })

    const audioBuffer = Buffer.from(response.data)
    const audioUrl = await uploadToS3(audioBuffer, 'audio/mpeg', `audio/${Date.now()}.mp3`)
    
    return audioUrl
  } catch (error) {
    console.error('ElevenLabs error:', error.message)
    throw error
  }
}

module.exports = { generateVoice }
