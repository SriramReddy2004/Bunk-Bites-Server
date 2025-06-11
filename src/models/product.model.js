const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        shopId: {
            type: mongoose.Types.ObjectId,
            ref: "shops",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: {
            type: String,
            require: true
        },
        avalialeQuantity: {
            type: Number,
            default: 0
        },
        
    }
)

const Product = mongoose.model("products", productSchema)

module.exports = { Product }