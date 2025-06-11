const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ["placed", "served", "rejected"]
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        bill: {
            type: Number,
            requiired: true
        }
    },
    {
        timestamps: true
    }
)