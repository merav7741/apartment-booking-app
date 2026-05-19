const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const { connect } = require('mongoose')

const connectDB = () => {
  connect(process.env.CONNECTION_STRING)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))
}

module.exports= {connectDB};
