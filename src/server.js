if (process.env.NODE_ENV !== "production") {
    require('dotenv').config() 
}

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()
const port = process.env.PORT || 4000

//Database
const databaseUrl = process.env.DATABASE_URL
mongoose.connect(databaseUrl)    
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Mongoose"))

//app configurations
app.use(express.urlencoded({extended: false})) //we can access the body of the request
app.use(express.static(path.join(__dirname, "../public"))) //all static files (images, styling) are located in the public folder
app.use(express.json()) //we can use json format

//routes
const registrationRouter = require("./routes/registration")
const dashboardRouter = require("./routes/dashboard")
const apiDashboardRouter = require("./routes/apiDashboard")
const loginRouter = require("./routes/login")

app.use("/registration", registrationRouter)
app.use("/api/dashboard", apiDashboardRouter)
app.use("/dashboard", dashboardRouter)
app.use("/login", loginRouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/index.html"))
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))

