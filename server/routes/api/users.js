const express = require("express")
const router = express.Router()
const User = require("../../models/user")
const UnverifiedUser = require("../../models/unverifiedUser")

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

router.get("/:name", async (req, res) => { //change to username
    const { name } = req.params
    const userName = name.replace("@", "")
    try {
        const user = await User.findOne({ "name": userName })
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})
router.delete("/:name", async (req, res) => { //change to username
    const { name } = req.params
    const userName = name.replace("@", "")
    try {
        const user = await User.findOne({ name: userName })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await User.findOneAndDelete({ name: userName })
        await UnverifiedUser.findOneAndDelete({ email: user.email })

        res.status(200).json({ message: "Successfully deleted" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router