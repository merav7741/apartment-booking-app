const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require("../service/orderService")

const create = async (req, res) => {
  try {
    const { apartmentId, startDate, endDate } = req.body
    const customerId = req.user.userId
    
    if (!apartmentId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields: apartmentId, startDate, endDate' })
    }

    const Apartment = require('../models/Apartment')
    const apartment = await Apartment.findById(apartmentId)
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' })
    }

    const order = await createOrder({
      customerId,
      landlordID: apartment.ownerId,
      apartmentId,
      startDate,
      endDate
    })
    
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getAll = async (req, res) => {
  try {
    const orders = await getAllOrders()
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' })
    }
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getById = async (req, res) => {
  try {
    const { id } = req.params
    const order = await getOrderById(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const order = await updateOrder(id, req.body)
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params
    const order = await deleteOrder(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json({ message: 'Order deleted successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getOrdersByLandlord = async (req, res) => {
  try {
    const landlordId = req.user.userId
    const orders = await require('../service/orderService').getOrdersByLandlord(landlordId)
    res.json(orders)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getOrdersByCustomer = async (req, res) => {
  try {
    const customerId = req.user.userId
    const orders = await require('../service/orderService').getOrdersByCustomer(customerId)
    res.json(orders)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getBookedDates = async (req, res) => {
  try {
    const { apartmentId } = req.params
    const bookedDates = await require('../service/orderService').getBookedDates(apartmentId)
    res.json(bookedDates)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = { create, getAll, getById, update, remove, getOrdersByLandlord, getOrdersByCustomer, getBookedDates }











