const { registerUser ,loginUser } = require('../service/authService')

const register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body
        const result = await registerUser(name, email, phone, password, role)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
 
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await loginUser(email, password)
        res.json(result)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { register, login }