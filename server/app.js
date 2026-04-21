const express = require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const PORT=process.env.PORT
const app = express()
app.use(express.json())

const {connectDB}=require('./config/db');
connectDB()


const User = require('./models/User')
const Apartment = require('./models/Apartment')



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})