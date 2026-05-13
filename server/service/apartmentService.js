const Apartment = require('../models/Apartment')

const getAllApartments = async (filters = {}) => {
  if (!filters || typeof filters !== 'object') {
    throw new Error('Filters must be an object')
  }
  return await Apartment.find(filters).populate('ownerId', 'fullName name');
}

const getApartmentById = async (id) => {
  if (!id) throw new Error('Apartment id is required')
  return await Apartment.findById(id).populate('ownerId', 'fullName name');
}

const createApartment = async (data) => {
  if (data.price < 0) throw new Error('Price must be greater than 0')
  if (data.pricePerNight < 0) throw new Error('Price per night must be greater than 0')
  if (data.bedrooms < 0) throw new Error('Bedrooms cannot be negative')
  return await Apartment.create(data)
}

const updateApartment = async (id, data) => {
  return await Apartment.findByIdAndUpdate(id, data, { new: true }).populate('ownerId', 'fullName name');
}

const deleteApartment = async (id) => {
  return await Apartment.findByIdAndDelete(id)
}

const getDatesBetween = (startDate, endDate) => {
  const dates = []
  const current = new Date(startDate)
  current.setHours(0, 0, 0, 0)
  const last = new Date(endDate)
  last.setHours(0, 0, 0, 0)

  while (current <= last) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

const bookApartment = async (id, bookingData) => {
  const { guestId, guestName, startDate, endDate } = bookingData
  if (!guestId || !guestName || !startDate || !endDate) {
    throw new Error('Missing booking details')
  }

  const apartment = await Apartment.findById(id)
  if (!apartment) {
    throw new Error('Apartment not found')
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  if (end < start) {
    throw new Error('Invalid date range')
  }

  const requestedDates = getDatesBetween(start, end)
  const existingDates = new Set(
    (apartment.notAvailableDates || []).map((date) => new Date(date).toDateString())
  )

  const conflict = requestedDates.some((date) => existingDates.has(date.toDateString()))
  if (conflict) {
    throw new Error('Some requested dates are already booked')
  }

  const bookingEntry = {
    guestId,
    guestName,
    startDate: start,
    endDate: end
  }

  const updatedApartment = await Apartment.findByIdAndUpdate(
    id,
    {
      $push: {
        notAvailableDates: { $each: requestedDates },
        bookings: bookingEntry
      }
    },
    { new: true }
  ).populate('ownerId', 'fullName name')

  return updatedApartment
}

module.exports = { getAllApartments, getApartmentById, createApartment, updateApartment, deleteApartment, bookApartment }