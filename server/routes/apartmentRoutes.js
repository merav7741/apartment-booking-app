const { getAll, getById, create, update, remove } = require('../controllers/apartmentController')
const express = require('express')
const router = express.Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router