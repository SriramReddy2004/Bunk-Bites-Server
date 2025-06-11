const path = require('path');
const { Router } = require("express");
const { allow } = require('../middlewares/role.middleware');
const { createShop, updateShopStatus, addProduct, deleteProduct, updateProductDetails, processOrder } = require('../controllers/vendor.controller');

const vendorRouter = Router()

vendorRouter.post("/create-shop", createShop)
vendorRouter.put("/update-shop-status", updateShopStatus)
vendorRouter.post("/add-product", addProduct)
vendorRouter.delete("/delete-product", deleteProduct)
vendorRouter.put("/update-product", updateProductDetails)
vendorRouter.put("/process-order", processOrder)
// update order status <-- msg queue
// generate report at the end of the day <-- delete db here


module.exports = { vendorRouter }

