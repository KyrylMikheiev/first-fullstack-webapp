if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: './server/.env' }) 
}

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()
const port = process.env.PORT || 4000

//Database
const databaseUrl = process.env.DATABASE_URL
// console.log(process.env)
mongoose.connect(databaseUrl)    
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Mongoose"))

//app configurations
app.use(express.urlencoded({extended: false})) //we can access the body of the request
app.use(express.static(path.join(__dirname, "../client"))) //all static files (images, styling) are located in the client folder
app.use(express.json()) //we can use json format

//routes
const registrationRouter = require("./routes/registration")
const dashboardRouter = require("./routes/dashboard")
// const apiDashboardRouter = require("./routes/apiDashboard")
const loginRouter = require("./routes/login")
const apiUsersRoute = require("./routes/api/users")
const apiRegistrationRoute = require("./routes/api/registration")

app.use("/registration", registrationRouter)
app.use("/dashboard", dashboardRouter)
app.use("/login", loginRouter)
app.use("/api/registration", apiRegistrationRoute)
app.use("/api/users", apiUsersRoute)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/index.html"))
})

app.get("/users/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/user.html"))
})
app.listen(port, () => console.log(`Server has started on port: ${port}`))

