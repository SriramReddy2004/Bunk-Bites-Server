const debugPrint = (data) => {
    if(process.env.MODE === "DEVELOPMENT") {
        console.log(data)
    }
}

module.exports = { debugPrint }