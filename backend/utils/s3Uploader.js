const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
})

async function uploadToS3(buffer, contentType, key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key || `generated/${uuidv4()}`,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read'
  }
  
  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    console.error('S3 upload error:', error)
    throw error
  }
}

module.exports = { uploadToS3 }
