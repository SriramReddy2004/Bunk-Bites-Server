const mongoose = require('mongoose');
const { debugPrint } = require('../utils/debug');

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URL)
        debugPrint("Database connection successfully established")
    }
    catch(e) {
        debugPrint(`Error connecting to DB: ${e}`)
    }
}

module.exports = { connectToDB }