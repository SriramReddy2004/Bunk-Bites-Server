const path = require('path');
const { Router } = require("express")

const { loginUser, registerUser, verifyUserRegistration } = require("../controllers/user.controller")
const { formatUserData } = require("../middlewares/formatUserData.middleware")
const { validateJWT } = require("../middlewares/validateJWT.middleware")

const userRouter = Router()

userRouter.post("/login", formatUserData, loginUser)
userRouter.post("/signup", formatUserData, registerUser)
userRouter.post("/verify", validateJWT, verifyUserRegistration)

module.exports = { userRouter }