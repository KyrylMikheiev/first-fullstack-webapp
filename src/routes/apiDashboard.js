const express = require("express")
const router = express.Router()
const User = require("../models/user")
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")

router.post("/", async (req, res) => {
    // //get an email
    // const { email } = req.body
    // //send a verification code (otp)
    // generateOTP()
    // sendOTP(email)
    // //get Users typed otp

    // //check if it is right
    // if (userOTP === otp) {
    //     //if it is, let the user type username and password
    //     res.redirect("/lastStep")
    // } else {
    //     res.status(400).send("Wrong otp")
    // }
    //hash the password
    //save the user to database

    //how it was before
    // try {
    //     const user = new User({
    //         name: req.body.name,
    //         email: req.body.email,
    //         dateOfBirth: req.body.birthday
    //         // password: req.body.password
    //     })
    //     const newUser = await user.save()
    //     res.redirect("/dashboard")
    // } catch (error) {
    //     console.log(error)
    //     res.status(400)
    // }
}) 

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
    userName = name.replace("@", "")
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