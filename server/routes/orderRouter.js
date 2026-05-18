const express = require('express')
const router = express.Router()
const { create, getAll, getById, update, remove, getOrdersByLandlord, getOrdersByCustomer, getBookedDates } = 
require('../controllers/orderControler')
const { verifyToken, verifySubscriberOrAdmin } = require('../middleware/auth')

router.get('/booked-dates/:apartmentId', getBookedDates)

router.post('/', verifyToken, create)
router.get('/', verifyToken, verifySubscriberOrAdmin, getAll)
router.get('/by-customer', verifyToken, getOrdersByCustomer)
router.get('/by-landlord', verifyToken, getOrdersByLandlord)
router.get('/:id', verifyToken, getById)
router.put('/:id', verifyToken, update)
router.delete('/:id', verifyToken, remove)

module.exports = router