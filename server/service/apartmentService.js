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

module.exports = { getAllApartments, getApartmentById, createApartment, updateApartment, deleteApartment }