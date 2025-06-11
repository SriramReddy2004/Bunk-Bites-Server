const priority = {
    "admin": 1,
    "vendor": 2,
    "user": 3
}

const allow = (role) => {
    return (req, res, next) => {
        if(priority[req.user.role] <= priority[role]) {
            return next()
        }
        return res.status(403).json({ message: "You don't have permission to perform this operation" })
    }
}

module.exports = { allow }