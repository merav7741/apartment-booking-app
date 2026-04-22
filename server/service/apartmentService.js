const Apartment = require('../models/Apartment')

const getAllApartments = async (filters = {}) => {
  if (!filters || typeof filters !== 'object') {
    throw new Error('Filters must be an object')
  }
  return await Apartment.find(filters)
}

const getApartmentById = async (id) => {
  if (!id) throw new Error('Apartment id is required')
  await Apartment.findById(id)
}

const createApartment = async (data) => {
  if (data.price < 0) throw new Error('Price must be greater than 0')
  if (data.pricePerNight < 0) throw new Error('Price per night must be greater than 0')
  if (data.bedrooms < 0) throw new Error('Bedrooms cannot be negative')
  return await Apartment.create(data)
}

const updateApartment = async (id, data) => {
  await Apartment.findByIdAndUpdate(id, data, { new: true })
}

const deleteApartment = async (id) => {
   await Apartment.findByIdAndDelete(id)

}

module.exports = { getAllApartments, getApartmentById, createApartment, updateApartment, deleteApartment }
