const formatUserData = (req, res, next) => {
    if(req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase()
    }
    if(req.body.emailOrPhone) {
        req.body.emailOrPhone = req.body.emailOrPhone.trim().toLowerCase()
    }
    if(req.body.username) {
        req.body.username = req.body.username.trim()
    }
    if(req.body.phone) {
        req.body.phone = req.body.username.trim().toLowerCase()
    }
    next()
}

module.exports = { formatUserData }