const express = require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const PORT=process.env.PORT
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())

const {connectDB}=require('./config/db');
connectDB()


const User = require('./models/User')
const Apartment = require('./models/Apartment')
const apartmentRoutes = require('./routes/apartmentRoutes')
const authRoutes = require('./routes/authRouter')

app.use('/api/auth', authRoutes)
app.use('/api/apartments', apartmentRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})