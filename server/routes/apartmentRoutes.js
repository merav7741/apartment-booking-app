const { getAll, getById, create, update, remove, getMyApartments, book } = require('../controllers/apartmentController')
const { verifyToken, verifySubscriberOrAdmin } = require('../middleware/auth')
const express = require('express')
const router = express.Router()

router.get('/', getAll)
router.get('/my-apartments', verifyToken, getMyApartments)
router.get('/:id', getById)
router.post('/', verifyToken, verifySubscriberOrAdmin, create)
router.put('/:id/book', verifyToken, book)
router.put('/:id', verifyToken, update)
router.delete('/:id', verifyToken, remove)

module.exports = router
