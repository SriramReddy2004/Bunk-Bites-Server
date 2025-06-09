const { Router } = require("express")
const { userRouter } = require("./user.route")
const { adminRouter } = require("./admin.route")
const { vendorRouter } = require("./vendor.route")

const mainRouter = Router()

mainRouter.use("/user", userRouter)
mainRouter.use("/admin", adminRouter)
mainRouter.use("/vendor", vendorRouter)

module.exports = { mainRouter }