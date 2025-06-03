const { Router } = require("express")
const { userRouter } = require("./user.route")

const mainRouter = Router()

mainRouter.use("/user", userRouter)

module.exports = { mainRouter }