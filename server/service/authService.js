const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (name, email, phone, password, role) => {
    try {
        if (!name || !email || !phone || !password) throw new Error('All fields are required')
        const existingUser = await User.findOne({ email })
        if (existingUser) throw new Error('this user already exists')
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, phone, password: hashedPassword, role })
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );
        return { token, user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role } }
    } catch (err) {
        throw new Error(err.message)
    }
}

const login = async (email, password) => {
    try {
        if (!email || !password) throw new Error('Email and password are required')
        const user = await User.findOne({ email })
        if (!user) throw new Error('Invalid credentials')
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new Error('Invalid credentials')
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );
        return { token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = { registerUser: register , loginUser: login }
