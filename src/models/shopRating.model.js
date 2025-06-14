const mongoose = require('mongoose');

const shopRatingSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Types.ObjectId,
        ref: "shops",
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

const ShopRating = mongoose.model("shop ratings", shopRatingSchema)

module.exports = { ShopRating }