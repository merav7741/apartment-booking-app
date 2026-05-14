const { model, Schema } = require('mongoose')
const OrderSchema = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        landlordID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        apartmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Apartment',
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        numberOfNights: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Canceled', 'Pending Approval', 'Approved'],
            default: 'Pending Approval'
        }
    },
    {
        timestamps: true
    }
)

const order = model('Order', OrderSchema)
module.exports = { order, OrderSchema }