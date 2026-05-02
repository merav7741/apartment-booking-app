const express = require('express')
const router = express.Router()
const { register, login, upgrade } = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.put('/upgrade', verifyToken, upgrade)

module.exports = router