const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true
        },
        shopName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "closed"
        },
        shopLogo: {
            type: String,
        }
    }
)

const Shop = mongoose.model("shops", shopSchema)

module.exports = { Shop }