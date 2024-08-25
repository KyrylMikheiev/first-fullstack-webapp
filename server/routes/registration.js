const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/registration/index.html"))
})

router.get("/verification", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/registration/verification.html"))
})

router.get("/laststep", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/registration/lastStep.html"))
})

module.exports = router