const { getAll, getById, create, update, remove } = require('../controllers/apartmentController')
const { verifyToken, verifySubscriberOrAdmin } = require('../middleware/auth')
const express = require('express')
const router = express.Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', verifyToken, verifySubscriberOrAdmin, create)  // ← הוספנו הגנה כאן
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router
