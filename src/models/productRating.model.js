const mongoose = require('mongoose');

const productRatingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: "products",
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

const ProductRating = mongoose.model("product ratings", productRatingSchema)

module.exports = { ProductRating }