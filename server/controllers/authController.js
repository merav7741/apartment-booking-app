const { registerUser ,loginUser } = require('../service/authService')

const register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body
        
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields: name, email, phone, password, role' })
        }
        const result = await registerUser(name, email, phone, password, role)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
 
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required fields: email, password' })
        }
        const result = await loginUser(email, password)
        res.json(result)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { register, login }