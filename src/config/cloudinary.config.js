const cloudinary = require("cloudinary").v2
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const productsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products",
        allowed_formats: ["png", "jpg", "jpeg"]
    }
})

const shopsStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "shops",
        allowed_formats: ["png", "jpg", "jpeg"]
    }
})

const products = multer({ storage: productsStorage })
const shops = multer({ storage: shopsStorage })

module.exports = { products, shops }