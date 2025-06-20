const path = require('path');
const { Router } = require("express");
const { products, shops } = require('../config/cloudinary.config');
const { createShop, updateShopStatus, addProduct, deleteProduct, updateProductDetails, getAllShopsOfAVendor } = require('../controllers/vendor.controller');

const vendorRouter = Router()

vendorRouter.post("/create-shop", shops.single("image"), createShop)
vendorRouter.put("/update-shop-status", updateShopStatus)
vendorRouter.post("/add-product", products.single("image"), addProduct)
vendorRouter.delete("/delete-product", deleteProduct)
vendorRouter.put("/update-product", updateProductDetails)
vendorRouter.get("/get-all-shops", getAllShopsOfAVendor)
// update order status <-- msg queue
// generate report at the end of the day <-- delete db here


module.exports = { vendorRouter }

