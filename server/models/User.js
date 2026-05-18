const { model, Schema } = require("mongoose")
const UserScema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: 'אימייל לא תקין'
            }
        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: (v) => /^05\d{8}$/.test(v),
                message: 'מספר פלאפון חייב להתחיל ב-05 ולהכיל 10 ספרות'
            }
        },
        password: {
            type: String,
            unique: true,
            trim: true,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            required: true,
            enum: ['Admin', 'Subscriber'], 
            default: 'Subscriber'
        }
    }
)

const user = model('User', UserScema)
module.exports = user    