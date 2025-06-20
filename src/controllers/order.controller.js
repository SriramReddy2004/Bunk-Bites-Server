const mongoose = require("mongoose");
const { Order } = require("../models/order.model");
const { Product } = require("../models/product.model");
const { debugPrint } = require("../utils/debug");
const { Shop } = require("../models/shop.model");

// const placeOrder = async (req, res) => {
//   const { products } = req.body; // [{ prodId, quantity }]
//   const { userId } = req.user;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     let bill = 0;
//     const productIds = products.map(p => new mongoose.Types.ObjectId(p.prodId));

//     const productDocs = await Product.find({ _id: { $in: productIds } }).session(session);
//     if (productDocs.length !== products.length) {
//       throw new Error("Some product IDs are invalid.");
//     }

//     const productsForModel = [];

//     for (const p of products) {
//       const productDoc = productDocs.find(doc => doc._id.toString() === p.prodId);
//       if (!productDoc) throw new Error(`Product not found: ${p.prodId}`);

//       // ✅ Fix: Check and update `avaliableQuantity`
//       const updatedProduct = await Product.findOneAndUpdate(
//         { _id: productDoc._id, avaliableQuantity: { $gte: p.quantity } },
//         { $inc: { avaliableQuantity: -p.quantity } },
//         { session, new: true }
//       );
//       debugPrint(updatedProduct)

//       if (!updatedProduct) {
//         throw new Error(`Insufficient stock for product: ${productDoc.name}`);
//       }


//       const cost = p.quantity * productDoc.price;
//       bill += cost;

//       productsForModel.push({
//         product: productDoc._id, // ✅ Fix: match your order schema's field
//         quantity: p.quantity
//       });
//     }

//     const newOrder = new Order({
//       userId,
//       products: productsForModel,
//       bill
//     });

//     await newOrder.save({ session });
//     await session.commitTransaction();

//     res.status(201).json({ success: true, order: newOrder });

//   } catch (err) {
//     await session.abortTransaction();
//     res.status(400).json({ success: false, message: err.message });
//   } finally {
//     session.endSession();
//   }
// };



const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;
    const { products, shopId } = req.body;

    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shop.status === "closed") {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: "Sorry, we're closed right now" });
    }

    if (!products || typeof products !== 'object' || Object.keys(products).length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Products object is required" });
    }

    const productIds = Object.keys(products).map(id => new mongoose.Types.ObjectId(id));
    
    const productDocs = await Product.find({ _id: { $in: productIds } }).session(session);

    const bulkOps = [];
    const orderItems = [];
    let totalBill = 0;

    for (const product of productDocs) {
      const requestedQty = products[product._id.toString()];
      if (!requestedQty || requestedQty <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Invalid quantity for product: ${product.name}` });
      }

      if (product.avalialeQuantity < requestedQty) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient quantity for product: ${product.name}` });
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id, avalialeQuantity: { $gte: requestedQty } },
          update: { $inc: { avalialeQuantity: -requestedQty } }
        }
      });

      orderItems.push({
        product: product._id,
        quantity: requestedQty
      });

      totalBill += product.price * requestedQty;
    }

    // Execute bulk update
    const updateResult = await Product.bulkWrite(bulkOps, { session });
    if (updateResult.modifiedCount !== productDocs.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Failed to update all product quantities" });
    }

    // Save order
    const newOrder = new Order({
      userId,
      shopId,
      products: orderItems,
      bill: totalBill,
      status: 'placed'
    });

    await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.error(e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
};

const processOrder = (req, res) => {
  
}


const generateReport = async (req, res) => {
  try {
    
  }
  catch(e) {
    debugPrint(e); // or debugPrint(e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}

module.exports = { placeOrder, generateReport };
