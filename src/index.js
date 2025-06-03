const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const { debugPrint } = require("./utils/debug");
const { mainRouter } = require('./routes/main.route');
const { connectToDB } = require('./config/connectToDB');

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api", mainRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
    debugPrint(`Server is listening on port: ${port}`)
    connectToDB()
})