const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
    {
        vendorName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Vendor = mongoose.model("vendors", vendorSchema)

module.exports = { Vendor }