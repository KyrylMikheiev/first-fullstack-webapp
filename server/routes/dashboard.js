const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/dashboard.html"))    
})

router.delete("/", (req, res) => {
    res.send("deleted")
})

router.get("/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/user.html"))
})

module.exports = router