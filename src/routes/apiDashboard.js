const express = require("express")
const router = express.Router()
const User = require("../models/user")
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")

router.post("/", async (req, res) => {

    const userEmail = req.body.email
    const { name } = req.body
    
    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: "https://mailgen.js/"
        }
    })
    
    let response = {
        body: {
            name: name,
            intro: "Your verification code",
            //example
            h1: sendOTP(),
            table: {
                data: [
                    {
                        item: "Nodemailer Stack Book",
                        description: sendOTP(),
                    }
                ]
            },
            outro: "Looking forward to do more business" 
        }
    }
    
    let mail = MailGenerator.generate(response) //generates an email based on object "response"
    
    let message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "place order",
        html: mail
    }
    
    let config = {
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config)
    
    transporter.sendMail(message)
        .then(() => {
            return res.redirect("/registration/verification")
            // res.status(201).json({
            //     msg: "you should have received an email"
            // })
        })
        .catch((error) => {
            return res.status(500).json({error})
        })

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

//not secure, possibility that user enters one wrong digit/the same otp. For now it is okay
function sendOTP(email) {
    const date = Date.now()
    const pin = date.toString().slice(-6)
    return pin
}

module.exports = router