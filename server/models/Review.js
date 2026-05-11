const { model, Schema } = require("mongoose")

const ReviewSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const review = model('Review', ReviewSchema)
module.exports = {review,ReviewSchema}