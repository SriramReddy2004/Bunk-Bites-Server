const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ["placed", "served", "rejected"],
            default: "placed"
        },
        shopId: {
            type: mongoose.Types.ObjectId,
            ref: "shops"
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        bill: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("orders", orderSchema)

module.exports = { Order }