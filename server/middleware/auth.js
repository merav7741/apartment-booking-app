const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'אין הרשאה - נדרש token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET )
        req.user = decoded 
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token לא תקין' })
    }
}

const verifySubscriberOrAdmin = (req, res, next) => {
    if (req.user.role === 'Admin' || req.user.role === 'Subscriber') {
        next()
    } else {
        return res.status(403).json({ message: 'אין לך הרשאה להוסיף דירות. נדרש מנוי. או מנהל' })
    }
}

module.exports = { verifyToken, verifySubscriberOrAdmin }
