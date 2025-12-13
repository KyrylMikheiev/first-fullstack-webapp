const express = require("express")
const router = express.Router()

router.use("/registration", require("./registration"))
router.use("/users", require("./users"))
router.use("/login", require("./login"))

module.exports = router