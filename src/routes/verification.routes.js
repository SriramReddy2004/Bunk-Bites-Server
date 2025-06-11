const { Router } = require("express")
const path = require('path');

const verificationRouter = Router()


verificationRouter.get("/user/verify/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/verify.html"))
})

verificationRouter.get("/admin/approve/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/approve.html"))
})


module.exports = { verificationRouter }