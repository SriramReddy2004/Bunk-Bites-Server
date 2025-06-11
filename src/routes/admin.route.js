const { Router } = require("express")


const { approveVendorController } = require("../controllers/admin.controller")


const adminRouter = Router()

adminRouter.post("/process-vendor-request", approveVendorController)

module.exports = { adminRouter }