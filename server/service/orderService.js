const { Types } = require('mongoose')
const { order: Order } = require('../models/Order')
const User = require('../models/User')
const Apartment = require('../models/Apartment')

const isValidObjectId = (id) => Types.ObjectId.isValid(String(id))

const validateUserIds = async (customerId, landlordID) => {
    if (!isValidObjectId(customerId)) {
        throw new Error('Invalid customerId')
    }
    if (!isValidObjectId(landlordID)) {
        throw new Error('Invalid landlordID')
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

const validateApartment = async (apartmentId) => {
    if (!isValidObjectId(apartmentId)) {
        throw new Error('Invalid apartmentId')
    }
    const apartment = await Apartment.findById(apartmentId)
    if (!apartment) {
        throw new Error('Apartment not found')
    }
    return apartment
}

const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
        throw new Error('startDate must be before endDate')
    }
    
    if (start < new Date()) {
        throw new Error('startDate cannot be in the past')
    }
}

const checkDateConflict = async (apartmentId, startDate, endDate, excludeOrderId = null) => {
    const query = {
        apartmentId,
        status: { $ne: 'Canceled' },
        $or: [
            { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
        ]
    }
    
    if (excludeOrderId) {
        query._id = { $ne: excludeOrderId }
    }
    
    const conflict = await Order.findOne(query)
    if (conflict) {
        throw new Error('Selected dates conflict with existing booking')
    }
}

const calculateNights = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

const createOrder = async (data) => {
    const { customerId, landlordID, apartmentId, startDate, endDate } = data
    
    await validateUserIds(customerId, landlordID)
    const apartment = await validateApartment(apartmentId)
    validateDateRange(startDate, endDate)
    await checkDateConflict(apartmentId, startDate, endDate)
    
    const numberOfNights = calculateNights(startDate, endDate)
    const totalPrice = numberOfNights * apartment.price
    
    return await Order.create({
        customerId,
        landlordID,
        apartmentId,
        startDate,
        endDate,
        totalPrice,
        numberOfNights,
        status: 'Pending Approval'
    })
}

const getAllOrders = async () => {
    return await Order.find()
        .populate('customerId')
        .populate('landlordID')
        .populate('apartmentId')
}

const getOrderById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id')
    }
    return await Order.findById(id)
        .populate('customerId')
        .populate('landlordID')
        .populate('apartmentId')
}

const updateOrder = async (id, data) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id')
    }

    const existingOrder = await Order.findById(id)
    if (!existingOrder) {
        throw new Error('Order not found')
    }

    if (Object.keys(data).length === 1 && data.status) {
        return await Order.findByIdAndUpdate(id, { status: data.status }, { new: true })
            .populate('customerId')
            .populate('landlordID')
            .populate('apartmentId')
    }

    const customerId = data.customerId ?? existingOrder.customerId
    const landlordID = data.landlordID ?? existingOrder.landlordID
    const apartmentId = data.apartmentId ?? existingOrder.apartmentId
    const startDate = data.startDate ?? existingOrder.startDate
    const endDate = data.endDate ?? existingOrder.endDate

    await validateUserIds(customerId, landlordID)
    const apartment = await validateApartment(apartmentId)
    
    if (data.startDate || data.endDate) {
        validateDateRange(startDate, endDate)
        await checkDateConflict(apartmentId, startDate, endDate, id)
    }

    const numberOfNights = calculateNights(startDate, endDate)
    const totalPrice = numberOfNights * apartment.price

    return await Order.findByIdAndUpdate(id, {
        ...data,
        numberOfNights,
        totalPrice
    }, { new: true, runValidators: true })
        .populate('customerId')
        .populate('landlordID')
        .populate('apartmentId')
}

const deleteOrder = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id')
    }
    return await Order.findByIdAndDelete(id)
}

const getOrdersByLandlord = async (landlordId) => {
    if (!isValidObjectId(landlordId)) {
        throw new Error('Invalid landlordId')
    }
    
    return await Order.find({ landlordID: landlordId, status: { $ne: 'Canceled' } })
        .populate('customerId')
        .populate('apartmentId')
        .sort({ createdAt: -1 })
}

const getOrdersByCustomer = async (customerId) => {
    if (!isValidObjectId(customerId)) {
        throw new Error('Invalid customerId')
    }
    const fourMonthsFromNow = new Date()
    fourMonthsFromNow.setMonth(fourMonthsFromNow.getMonth() + 4)
    return await Order.find({
        customerId: customerId,
        $or: [
            { status: 'Canceled' },
            { startDate: { $lte: fourMonthsFromNow } }
        ]
    })
        .populate('landlordID')
        .populate('apartmentId')
        .sort({ createdAt: -1 })
}

const getBookedDates = async (apartmentId) => {
    if (!isValidObjectId(apartmentId)) {
        throw new Error('Invalid apartmentId')
    }
    const bookings = await Order.find({
        apartmentId,
        status: { $ne: 'Canceled' }
    }).select('startDate endDate')
    
    return bookings.map(booking => ({
        start: booking.startDate,
        end: booking.endDate
    }))
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrdersByLandlord,
    getOrdersByCustomer,
    getBookedDates
}
