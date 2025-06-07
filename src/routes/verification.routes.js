const { Router } = require("express")
const path = require('path');

const verificationRouter = Router()


verificationRouter.get("/user/verify/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/verify.html"))
})

verificationRouter.get("/user/error", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/error.html"))
})

verificationRouter.get("/user/success", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/success.html"))
})


module.exports = { verificationRouter }