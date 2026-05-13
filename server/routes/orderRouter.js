const express = require('express')
const router = express.Router()
const { create, getAll, getById, update, remove } = 
require('../controllers/orderControler')

router.get('/', verifySubscriberOrAdmin,getAll)
router.get('/ordersById',verifySubscriberOrAdmin, getById)
router.get('/allOrder',verifySubscriberOrAdmin, getAll)

module.exports = router