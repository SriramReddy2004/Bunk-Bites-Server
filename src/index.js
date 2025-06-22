const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


const { debugPrint } = require("./utils/debug");
const { mainRouter } = require('./routes/main.route');
const { connectToDB } = require('./config/connectToDB');
const { verificationRouter } = require('./routes/verification.routes');

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/static", express.static(path.join(__dirname, "../public/static")));

app.use(verificationRouter)
app.use("/api", mainRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
    debugPrint(`Server is listening on port: ${port}`)
    connectToDB()

    setInterval(() => {
        fetch(process.env.SERVER_URL)
    }, 840000)

})