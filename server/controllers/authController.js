const { registerUser ,loginUser ,upgradeToSubscriber } = require('../service/authService')

const register = async (req, res) => {
    try {
        const { name, email, phone, password, role, adminCode } = req.body
        
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields: name, email, phone, password, role' })
        }

        if (role === 'Admin') {
            if (adminCode !== process.env.ADMIN_SECRET_CODE) {
                return res.status(403).json({ error: 'קוד מנהל שגוי' })
            }
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

const upgrade = async (req, res) => {
    try {
        // req.user.userId מגיע מה-Middleware של ה-Auth שלך
        const result = await upgradeToSubscriber(req.user.userId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { register, login, upgrade };

