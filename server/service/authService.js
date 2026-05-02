const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (name, email, phone, password, role) => {
    if (role === 'Admin') {
        throw new Error('לא ניתן להירשם כמנהל')
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) throw new Error('User with this email already exists')
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, phone, password: hashedPassword, role })
    const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET ,
        { expiresIn: '24h' }
    );
    return { token, user: { _id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role } }
}

const login = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Invalid credentials')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid credentials')
        
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET ,
        { expiresIn: '24h' }
    );
    return { token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } }
}

const upgradeToSubscriber = async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { role: 'Subscriber' }, { new: true });
    if (!user) throw new Error('User not found');

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { registerUser: register, loginUser: login, upgradeToSubscriber };


