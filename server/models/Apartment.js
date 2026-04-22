const { model, Schema } = require("mongoose")
const { ReviewSchema } = require('./Review')

const Apartment = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        image: {
            type: [String]
        },
        city: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true,
            min: 0
        },
        location:
        {
            type: String,
            required: true,
            enum: [
                'Center',
                'North',
                'South',
                'East',
                'West'
            ]
            , default: 'Center'
        },
        description: {
            type: String
        },
        characteristics: {
            type: [String],
            enum: [
                // נוחות בסיסית
                'wifi', 'ac', 'heating', 'elevator', 'parking',
                // מטבח
                'kitchen', 'microwave', 'fridge', 'dishwasher', 'coffee_machine',
                // חוץ
                'garden', 'balcony', 'pool', 'jacuzzi','nearbyAttractions', 'nearbySynagogue',
                // שירותים
                'gym', 'sauna', 'security', 'cleaning_service',
                // נגישות
                'wheelchair_accessible', 'baby_crib', 'high_chair',
                // חיות מחמד
                'pets_allowed',
                // אחר
                'sea_view', 'mountain_view', 'city_view', 'fireplace', 'workspace'
            ]
        },
        notAvailableDates: {
            type: [Date]
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reviews: [ReviewSchema]

    },
    {
        timestamps: true
    }
)
const apartment = model('Apartment', Apartment)
module.exports = appartment