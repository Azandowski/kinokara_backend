const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require("./config");
const Post = require('./models/Post');

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

    async addPost(req, res) {
        const {review, value } = req.body
        const sendUser = await User.findById(req.user.id)
        const post = new Post({ value, username: sendUser.username, userId: req.user.id, review, datePost: Date.now(), })
        await post.save()
        res.json(post)
    }

    async getPostsForAdmin(req, res) {
        Post.find({ 'valid': false }, function (err, docs) {
            console.log(docs)
            res.json(docs)
        });
    }

    async getPosts(req, res) {
        Post.find({ 'valid': true }, function (err, docs) {
            console.log(docs)
            res.json(docs)
        });
    }

    async acceptPost(req, res) {
        const { postId } = req.body;
        const newpost = await Post.findByIdAndUpdate(postId, { "valid": true })
        console.log(newpost)
        res.json(newpost)
    }

    async declinePost(req, res) {
        const { postId } = req.body;
        try {
            console.log('delete post ' + postId);
            await Post.findByIdAndRemove(postId)
            res.json({'status': 'ok'})
        } catch (e) {
            res.js
            res.status(400).json({message: 'Delete error'})
        }
    }


}

module.exports = new authController()
