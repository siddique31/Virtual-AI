require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

// Import routes
const authRoutes = require('./routes/auth')
const generateRoutes = require('./routes/generate')

const app = express()

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests' }
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/generate', generateRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('📦 MongoDB connected')
  } catch (error) {
    console.error('MongoDB error:', error.message)
    process.exit(1)
  }
}

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`)
})

module.exports = app
