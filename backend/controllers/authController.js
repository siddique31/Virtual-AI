const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be 6+ characters' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        plan: user.plan
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        plan: user.plan,
        totalGenerations: user.totalGenerations
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
}

// Get Me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        plan: user.plan,
        totalGenerations: user.totalGenerations,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
}
