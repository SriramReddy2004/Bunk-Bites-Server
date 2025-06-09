const { User } = require("../models/user.model");

const approveVendorController = async (req, res) => {
    try {
        const { email, username, phone, password, role } = req.user;
        const newVendor = new User({ email, username, phone, password, role })
        await newVendor.save()
    }
    catch(e) {
        if(e.code === 11000) {
            return res.status(409).json({ message: "User with same email or phone number already exist" })
        }
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

module.exports = { approveVendorController }