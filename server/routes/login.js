const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/login/login.html"))
})

router.get("/forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/login/forgotPassword.html"))
})

router.get("/verification", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/verifi.html"))
})

router.get("/change-password", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/login/changePassword.html"))
})

module.exports = router