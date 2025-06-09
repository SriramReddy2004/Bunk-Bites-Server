const { Router } = require("express")
const { validateJWT } = require("../middlewares/validateJWT.middleware")


const { approveVendorController } = require("../controllers/admin.controller")


const adminRouter = Router()

adminRouter.post("/process-vendor-request", validateJWT, approveVendorController)

module.exports = { adminRouter }