const { Router } = require("express")
const { userRouter } = require("./user.route")
const { adminRouter } = require("./admin.route")
const { vendorRouter } = require("./vendor.route")
const { validateJWT } = require("../middlewares/validateJWT.middleware")
const { allow } = require("../middlewares/role.middleware")
const { orderRouter } = require("./order.route")

const mainRouter = Router()

mainRouter.use("/user", userRouter)
mainRouter.use("/admin", validateJWT, adminRouter)
mainRouter.use("/vendor", validateJWT, allow("vendor"), vendorRouter)
mainRouter.use("/order", validateJWT, orderRouter)

module.exports = { mainRouter }