const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "vendor", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("users", userSchema)

module.exports = { User }