const nodemailer = require('nodemailer');
const { debugPrint } = require('./debug');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
})

const sendMail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: to,
            subject: subject,
            text: text
        };
        return true
    }
    catch(e) {
        return false
    }
}

module.exports = { sendMail }