const Apartment = require('../models/Apartment')

const getAllApartments = (filters = {}) => Apartment.find(filters)

const getApartmentById = (id) => Apartment.findById(id)

const createApartment = (data) => Apartment.create(data)

const updateApartment = (id, data) => Apartment.findByIdAndUpdate(id, data, { new: true })

const deleteApartment = (id) => Apartment.findByIdAndDelete(id)

module.exports = { getAllApartments, getApartmentById, createApartment, updateApartment, deleteApartment }
