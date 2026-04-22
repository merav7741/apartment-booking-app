const { getAllApartments, getApartmentById ,createApartment,updateApartment ,deleteApartment} = require('../service/apartmentService');

const getAll=async(req, res) => {
    try {
        const apartments = await getAllApartments();
        if (apartments.length === 0) return res.status(404).json({ message: 'No apartments found' });
        res.json(apartments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'Apartment id is required' })
        }
        const apartment = await getApartmentById(id);
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' });
        res.json(apartment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}
 
const create = async (req, res) => {
    try {
        const { name, price, pricePerNight, address, bedrooms } = req.body
        if (!name || !price || !pricePerNight || !address || !bedrooms) {
            return res.status(400).json({ error: 'Missing required fields: name, price, pricePerNight, address, bedrooms' })
        }
        const apartmentData = {
            ...req.body,
            ownerId: req.user.userId 
        }
        const newApartment = await createApartment(apartmentData)
        if (!newApartment) return res.status(400).json({ message: 'Failed to create apartment' })
        res.status(201).json(newApartment)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'Apartment id is required' })
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Update data is required' })
        }        
        const updatedApartment = await updateApartment(id, req.body)
        if (!updatedApartment) return res.status(404).json({ message: 'Apartment not found' })
        res.json(updatedApartment)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'Apartment id is required' })
        }
        const apartment = await deleteApartment(id)
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' })
        res.json({ message: 'Apartment deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getAll, getById, create, update, remove }


