const { User } = require("../models/user.model");
const { sendMail } = require("../utils/sendMail");

const approveVendorController = async (req, res) => {
    try {
        const { email, username, phone, password, role } = req.user;
        const { status } = req.body;
        if(status === "rejected") {
            await sendMail(email, "Account rejected", "Your account has been rejected. Try contacting admin!")
            return res.status(200).json({ message: "Request rejected" })
        }
        const newVendor = new User({ email, username, phone, password, role })
        await Promise.all([
            newVendor.save(),
            sendMail(email, "Account approved", "Your account has been approved by admin. You can create your shops")
        ])

        res.status(201).json( { message: 'Account Approved' } )
    }
    catch(e) {
        if(e.code === 11000) {
            return res.status(409).json({ message: "User with same email or phone number already exist" })
        }
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

module.exports = { approveVendorController }