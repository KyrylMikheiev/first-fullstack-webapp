const express = require("express")
const router = express.Router()
const User = require("../../models/user")

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
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
        const user = await User.findOneAndDelete({ name: userName })
        res.status(201).json({ message: "Successfully deleted" });
    } catch (error) {
        console.log("error in api")
        res.json({message: error})
    }
})

module.exports = router