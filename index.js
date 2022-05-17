const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
var cors = require('cors')
const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://userkinokara:Qqwerty1@cluster0.aqwzr.mongodb.net/database_auth?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

