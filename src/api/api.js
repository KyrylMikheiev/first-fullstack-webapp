const express = require("express")
const router = express.Router()
const User = require("../models/user")
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")
const UnverifiedUser = require("../models/unverifiedUser")


router.post("/registration", async (req, res) => {

    const userEmail = req.body.email
    const { name } = req.body
    
    
    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: "https://mailgen.js/"
        }
    })
    
    const otpCode = generateOTP()
    let response = {
        body: {
            name: name,
            intro: "Your verification code",
            //example
            table: {
                data: [
                    {
                        item: "Nodemailer Stack Book",
                        description: otpCode,
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
        .then(async() => {
            try {
                const code = generateOTP()
                const userCreation = new UnverifiedUser({
                    email: userEmail,
                    verified: false,
                    otp: otpCode,
                })
                const newUser = await userCreation.save()
                const encodedEmail = encodeURIComponent(userEmail);
                return res.redirect(`/registration/verification?email=${encodedEmail}`);
            } catch (error) {
                res.json({ msg: error})
            }
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

router.post("/registration/verification", async(req, res) => {
    const encodedEmail = req.query.email
    const email = decodeURIComponent(encodedEmail)
    const codeInput1 = req.body.input1
    const codeInput2 = req.body.input2
    const codeInput3 = req.body.input3
    const codeInput4 = req.body.input4
    const codeInput5 = req.body.input5
    const codeInput6 = req.body.input6
    const code = codeInput1.toString() + codeInput2.toString() + codeInput3.toString() + codeInput4.toString() + codeInput5.toString() + codeInput6.toString() 
    
    try {
        const user = await UnverifiedUser.findOne({ "email": email })
        console.log(code.toString())
        console.log(user.otp.toString())
        if (user) { 
            if (user.otp.toString() === code.toString()) {
                user.verified = true
                console.log("Successfully verified")
                res.redirect(`/registration/lastStep?email=${encodeURIComponent(email)}`)
            } else {
                res.send("wrong otp, try again")
            }
        } else {
            res.status(404).send("you have skipped registration step, please try again")
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

router.get("users/:name", async (req, res) => { //change to username
    const { name } = req.params
    userName = name.replace("@", "")
    try {
        const user = await User.findOne({ "name": userName })
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})
router.delete("users/:name", async (req, res) => { //change to username
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
function generateOTP() {
    const date = Date.now()
    const pin = date.toString().slice(-6)
    return pin
}

module.exports = router