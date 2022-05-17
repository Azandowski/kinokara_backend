const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')

router.post('/registration', [
    check('username', "Username can not be empty").notEmpty(),
    check('password', "Password is too short").isLength({min:7, max:20})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)
router.post('/editUser', roleMiddleware(["ADMIN"]), controller.editUser)
router.delete('/user', roleMiddleware(["ADMIN"]), controller.deleteUser)
router.get('/currentUser', authMiddleware, controller.getCurrentUser)


module.exports = router
