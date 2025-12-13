if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: '.env' }) 
}

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()

//Database
const databaseUrl = process.env.DATABASE_URL
mongoose.connect(databaseUrl)    
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Mongoose"))

//app configurations
app.use(express.urlencoded({extended: false})) //we can access the body of the request (idk the differnce between app.use(bodyParser.json());) 
app.use(express.static(path.join(__dirname, "../client"))) //all static files (images, styling) are located in the client folder
app.use(express.json()) //we can use json format

//routes
const registrationRouter = require("./routes/registration")
const dashboardRouter = require("./routes/dashboard")
const loginRouter = require("./routes/login")
const apiRouter = require("./routes/api/api")

app.use("/registration", registrationRouter)
app.use("/dashboard", dashboardRouter)
app.use("/login", loginRouter)
app.use("/api", apiRouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/index.html"))
})

app.get("/users/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/user.html"))
})

module.exports = app
