require ('dotenv').config()
const {connect} = require('mongoose')

const connectDB = () => {
    connect(process.env.CONNECTION_STRING)
   .then(() => console.log('DB connected'))
   .catch(err => console.log(err))  
}   

module.exports= {connectDB};
