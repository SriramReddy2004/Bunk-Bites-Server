const path = require('path');
const { Router } = require("express")

const { loginUser, registerUser, verifyUserRegistration, getListOfAllShops, getProductsOfAShop, rateAProduct, rateAShop } = require("../controllers/user.controller")
const { formatUserData } = require("../middlewares/formatUserData.middleware")
const { validateJWT } = require("../middlewares/validateJWT.middleware")

const userRouter = Router()

userRouter.post("/login", formatUserData, loginUser)
userRouter.post("/signup", formatUserData, registerUser)
userRouter.post("/verify", validateJWT, verifyUserRegistration)
userRouter.get("/get-all-shops", getListOfAllShops)
userRouter.post("/get-products-of-a-shop", getProductsOfAShop)
userRouter.post("/rate-a-product", validateJWT, rateAProduct)
userRouter.post("/rate-a-shop", validateJWT, rateAShop)

module.exports = { userRouter }