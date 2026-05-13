const { getAllApartments, getApartmentById, createApartment, updateApartment, deleteApartment, bookApartment } = require('../service/apartmentService');

const getAll = async (req, res) => {
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
        const apartment = await getApartmentById(id)
        if (!apartment) return res.status(404).json({ message: 'Apartment not found' })

        const ownerId = typeof apartment.ownerId === 'object' ? apartment.ownerId._id.toString() : apartment.ownerId.toString()
        if (ownerId !== req.user.userId && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'אין הרשאה למחוק דירה זו' })
        }

        await deleteApartment(id)
        res.json({ message: 'Apartment deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const book = async (req, res) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.body

    if (!id) {
      return res.status(400).json({ error: 'Apartment id is required' })
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' })
    }

    const updatedApartment = await bookApartment(id, {
      guestId: req.user.userId,
      guestName: req.user.name || req.user.email || 'מזמין/ה',
      startDate,
      endDate
    })

    res.json(updatedApartment)
  } catch (err) {
    if (err.message.includes('already booked')) {
      return res.status(409).json({ message: err.message })
    }
    res.status(500).json({ message: err.message })
  }
}

const getMyApartments = async (req, res) => {
    try {
        const userId = req.user.userId
        const apartments = await getAllApartments({ ownerId: userId })
        res.json(apartments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


module.exports = { getAll, getById, create, update, remove, getMyApartments, book }


