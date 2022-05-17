const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require("./config")

const generateAccessToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, secret, {expiresIn: "2 days"} )
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            console.log(req.body)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Error during the registration", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "User with that name is already registered"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: "User registered succesfully"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({message: `User: ${username} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `You have typed incorrect password`})
            }
            const token = generateAccessToken(user._id)
            if (user.roles.includes("ADMIN")) {
                return res.json({ token, "isAdmin" : true})
            }
            return res.json({token, "isAdmin" : false})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find({ "username": { "$exists": true } }).sort({'username': 1})
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

    async editUser(req, res) {
        const { name, id } = req.body
        console.log('Update ' + name + ', ' + id);
        try {
            const newuser = await User.findByIdAndUpdate(id, { "username": name })
            console.log(newuser);
            res.json(newuser)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteUser(req, res) {
        const {id} = req.body
        try {
            console.log('delete user ' + id);
            await User.findByIdAndRemove(id)
            res.json({'status': 'ok'})
        } catch (e) {
            console.log(e)
        }
    }

    async getCurrentUser(req, res) {
        const user = await User.findById(req.user.id)
        res.json(user)      
    }


}

module.exports = new authController()
