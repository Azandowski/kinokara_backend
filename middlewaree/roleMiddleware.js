const jwt = require('jsonwebtoken')
const {secret} = require('../config');
const User = require('../models/User');

module.exports = function (roles) {
    return async function (req, res, next) {
        // next()
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            console.log(token)
            if (!token) {
                return res.status(403).json({ message: "User is not authenticated" })
            }
            const decoded = jwt.verify(token, secret)
            console.log(decoded)
            // const user = await User.findById(decoded._id)
            // console.log(user)
            // let hasRole = false
            // user.roles.forEach(role => {
            //     if (roles.includes(role)) {
            //         hasRole = true
            //     }
            // })
            // if (!hasRole) {
            //     return res.status(403).json({ message: "Only admin has access" })
            // }
            next();
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: "User is not authenticated" })
        }
    }
};