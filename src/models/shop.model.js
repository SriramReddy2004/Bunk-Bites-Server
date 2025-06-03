const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "Vendor"
        },
        shopName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["open", "closed"]
        }
    },
    {

    }
)

const Shop = mongoose.model("shops", shopSchema)

module.exports = { Shop }