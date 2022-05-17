const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    const notAuthenticatedMessage = "User is not authenticated"
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(403).json({message: notAuthenticatedMessage})
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: notAuthenticatedMessage})
    }
};
