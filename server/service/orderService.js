const { Types } = require('mongoose')
const { order: Order } = require('../models/Order')
const User = require('../models/User')

const isValidObjectId = (id) => Types.ObjectId.isValid(String(id))

const validateUserIds = async (customerId, landlordID) => {
    if (!isValidObjectId(customerId)) {
        throw new Error('Invalid customerId')
    }
    if (!isValidObjectId(landlordID)) {
        throw new Error('Invalid landlordID')
    }
    if (customerId.toString() === landlordID.toString()) {
        throw new Error('customerId and landlordID must be different users')
    }

    const [customer, landlord] = await Promise.all([
        User.findById(customerId),
        User.findById(landlordID)
    ])

    if (!customer) {
        throw new Error('customerId user not found')
    }
    if (!landlord) {
        throw new Error('landlordID user not found')
    }
}
const ensureNoActiveDuplicate = async ({ customerId, landlordID, status }) => {
    if (status === 'Canceled') return;

    const duplicate = await Order.findOne({
        customerId,
        landlordID,
        status: { $ne: 'Canceled' }
    });

    if (duplicate) {
        throw new Error('Already exists an active order between these users');
    }
}

const createOrder = async (data) => {
    await validateUserIds(data.customerId, data.landlordID)
    await ensureNoActiveDuplicate(data)
    return await Order.create(data)
}

const getAllOrders = async () => {
    return await Order.find()
}

const getOrderById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id')
    }
    return await Order.findById(id)
}

const updateOrder = async (id, data) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id')
    }

    const existingOrder = await Order.findById(id)
    if (!existingOrder) {
        throw new Error('Order not found')
    }

    const customerId = data.customerId ?? existingOrder.customerId
    const landlordID = data.landlordID ?? existingOrder.landlordID
    const status = data.status ?? existingOrder.status

    await validateUserIds(customerId, landlordID)
    await ensureNoActiveDuplicate({ customerId, landlordID, status }, id)

    return await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

const deleteOrder = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id')
    }
    return await Order.findByIdAndDelete(id)
}

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder }
