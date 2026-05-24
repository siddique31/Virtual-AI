const express = require('express')
const router = express.Router()
const { createGeneration, getGenerationStatus, getUserGenerations } = require('../controllers/generationController')
const auth = require('../middleware/auth')

router.use(auth)

router.post('/', createGeneration)
router.get('/', getUserGenerations)
router.get('/:id', getGenerationStatus)

module.exports = router
