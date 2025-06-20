const { Router } = require("express")
const { placeOrder } = require("../controllers/order.controller")
const { validateJWT } = require("../middlewares/validateJWT.middleware")

const orderRouter = Router()

orderRouter.post("/place-order", validateJWT, placeOrder)

module.exports = { orderRouter }