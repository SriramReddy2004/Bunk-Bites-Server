const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const { Shop } = require('../models/shop.model');
const { Product } = require('../models/product.model');
const { Order } = require("../models/order.model")
const { debugPrint } = require("../utils/debug")

const createShop = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { shopName } = req.body;
        if(shopName === undefined) {
            return res.status(400).json({ message: "Please provide shopName" })
        }
        const owner = req.user.userId;
        const newShop = new Shop({ owner, shopName, shopLogo: req.file.path })
        await newShop.save()
        return res.status(201).json({ message: "Shop created successfully" })
    }
    catch(e) {
        debugPrint(e)
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

const updateShopStatus = async (req, res) => {
    try {
        const { shopId, status } = req.body
        const shop = await Shop.findById(shopId)
        if(shop === null) {
            return res.status(404).json({ message: "Shop not found" })
        }
        if(shop.owner.toString() === req.user.userId) {
            shop.status = "closed"
            await shop.save()
            return res.status(200).json({ message: `Shop ${ status === true ? "open" : "closed" }` })
        }
        return res.status(403).json({ message: "Can't perform this operation" })
    }
    catch(e) {
        debugPrint(e)
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

const addProduct = async (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const { shopId, name, price, quantity } = req.body;
        if(shopId === undefined || name === undefined || price === undefined || quantity === undefined) {
            return res.status(400).json({ message: "Please provide all fields" })
        }
        const newProduct = new Product({ shopId, name, price, imageUrl: req.file.path, avalialeQuantity: quantity })
        await newProduct.save()
        return res.status(201).json({ message: "Product created successfully", product: newProduct })
    }
    catch(e) {
        debugPrint(e)
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if(productId === undefined) {
            return res.status(400).json({ message: "Please provide all fields" })
        }
        const product = await Product.findById(productId).populate("shopId")
        if(product['shopId']['owner'].toString() === req.user.userId) {
            await Product.findByIdAndDelete(productId)
            return res.status(200).json({ message: "Product removed successfully" })
        }
        return res.status(403).json({ message: "Can't perform this operation" })
    }
    catch(e) {
        debugPrint(e)
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

const updateProductDetails = async (req, res) => {
    try {
        const { productId, name, price, imageUrl, avalialeQuantity } = req.body;
        const product = await Product.findById(productId).populate('shopId')
        if(product['shopId']['owner'].toString() === req.user.userId) {
            if(name) product.name = name
            if(price) product.price = price
            if(imageUrl) product.imageUrl = imageUrl
            if(avalialeQuantity) product.avalialeQuantity = avalialeQuantity
            await product.save()
            return res.status(200).json({ message: "Product updated successfully" })
        }
        return res.status(403).json({ message: "Can't perform this operation" })
    }
    catch(e) {
        debugPrint(e)
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

const processOrder = async (req, res) => {
    try {
        
    }
    catch(e) {
        debugPrint(e)
        return res.status(500).json({ message: "Internal server error", error: e })
    }
}

// Testing Process Order
const processOrderrr = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId, action } = req.body; 
        const vendorId = req.user.userId;

        if (!['served', 'rejected'].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Must be 'served' or 'rejected'" });
        }

        const order = await Order.findById(orderId).populate('products.product').session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Order not found' });
        }

        const vendorProductIds = (await Product.find({ shopId: { $exists: true }, }).populate('shopId'))
            .filter(prod => prod.shopId.owner.toString() === vendorId)
            .map(prod => prod._id.toString());

        const isVendorInvolved = order.products.some(p =>
            vendorProductIds.includes(p.product._id.toString())
        );

        if (!isVendorInvolved) {
            await session.abortTransaction();
            return res.status(403).json({ message: "You are not authorized to process this order" });
        }

        order.status = action;
        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: `Order ${action} successfully` });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        debugPrint(e);
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};

module.exports = { createShop, updateShopStatus, addProduct, deleteProduct, updateProductDetails, processOrder, processOrderrr }