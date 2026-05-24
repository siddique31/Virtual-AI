const ffmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream')

async function mergeVideoAndAudio(videoUrl, audioUrl) {
  return new Promise((resolve, reject) => {
    try {
      const outputStream = new PassThrough()
      const chunks = []
      
      outputStream.on('data', chunk => chunks.push(chunk))
      outputStream.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      })
      outputStream.on('error', reject)
      
      ffmpeg()
        .input(videoUrl)
        .input(audioUrl)
        .outputOptions([
          '-c:v libx264',
          '-c:a aac',
          '-shortest',
          '-map 0:v:0',
          '-map 1:a:0',
          '-preset fast',
          '-crf 23'
        ])
        .format('mp4')
        .on('error', reject)
        .pipe(outputStream, { end: true })
        
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = { mergeVideoAndAudio }
