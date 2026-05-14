const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 5500
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())

const { connectDB } = require('./config/db')
connectDB()

const apartmentRoutes = require('./routes/apartmentRoutes')
const authRoutes = require('./routes/authRouter')
const orderRoutes = require('./routes/orderRouter')

app.use('/api/auth', authRoutes)
app.use('/api/apartments', apartmentRoutes)
app.use('/api/orders', orderRoutes)

const logRegisteredRoutes = () => {
  const stack = app._router?.stack
  if (!stack) {
    console.log('Registered routes: none available yet')
    return
  }

  const routes = stack
    .filter((layer) => layer.route)
    .map((layer) => {
      const path = layer.route.path
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase()
      return `${methods} ${path}`
    })

  console.log('Registered routes:')
  routes.forEach((route) => console.log(`  - ${route}`))
}

logRegisteredRoutes()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})