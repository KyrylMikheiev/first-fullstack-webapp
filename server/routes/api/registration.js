const express = require("express")
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")
const path = require("path")
const bcrypt = require("bcrypt")
// const fs = require('fs');
const User = require("../../models/user")
const UnverifiedUser = require("../../models/unverifiedUser")

const router = express.Router()
/**
 * ToDos:
 * - split in seperate files api
 * - styling for email
 */
router.post("/", async (req, res) => {
    
    const userEmail = req.body.email
    const { name } = req.body
    const otpCode = generateOTP()

   

    // var mailGenerator = new Mailgen({
    //     theme: {
    //         // Build an absolute path to the theme file within your project
    //         path: path.resolve('assets/mailgen/theme.html'),
    //         // Also (optionally) provide the path to a plaintext version of the theme (if you wish to use `generatePlaintext()`)
    //         plaintextPath: path.resolve('assets/mailgen/theme.txt')
    //     },
    //     // Configure your product as usual (see examples above)
    //     product: {}
    // });
    
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

    // const emailTemplate = fs.readFileSync(path.join(__dirname, "../emails/otp.html"))
    
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

    try {
        const oldUser = await UnverifiedUser.findOne({email: userEmail})
        if (oldUser) {
            if (!oldUser.verified) {
                oldUser.otp = otpCode
                oldUser.codeCreationDate = Date.now()
                oldUser.codeExpirationDate = Date.now() + 10 * 60 * 1000
                await oldUser.save()
            } else {
                return res.send("User with this email is already verified. Log in")
            }
        } else {
            const userCreation = new UnverifiedUser({
                email: userEmail,
                verified: false,
                otp: otpCode,
            })
            await userCreation.save()
        }
        await transporter.sendMail(message)
        console.log("Email was send to the user")
        const encodedEmail = encodeURIComponent(userEmail);
        return res.redirect(`/registration/verification?email=${encodedEmail}`);
    } catch (error) {
        res.json({ msg: error})
    }    
}) 

router.post("/verification", async(req, res) => {

    const encodedEmail = req.query.email
    const email = decodeURIComponent(encodedEmail)
    //wtf ------------------------------------------------ get it right g ------------------------------
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
            // console.log("Expiration date", user.codeExpirationDate.getTime())
            // console.log("now", Date.now())
            if (user.codeExpirationDate.getTime() > Date.now()) {
                if (user.otp.toString() === code.toString()) {
                    // user.verified = true
                    // await user.save()
                    console.log("Successfully verified")
                    res.redirect(`/registration/lastStep?email=${encodeURIComponent(email)}`)
                } else {
                    res.send("wrong otp, try again")
                }
            } else {
                //is it necessary?
                // user.otp = null
                // user.codeCreationDate = null
                // user.codeExpirationDate = null
                // await user.save()
                // console.log(user)
                res.send("Your code has been expired. Try to resend!")
            }
        } else {
            res.status(404).send("you have skipped registration step, please try again")
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post("/lastStep", async (req, res) => {
    const { email } = req.query
    const userEmail = decodeURIComponent(email)
    try {
        const isUsernameValid = await User.findOne({ username: req.body.username})
        if (isUsernameValid) {
            return res.send("User with this username already exists. Try another one...")
        }
        console.log("User with this username doesnt exist yet, so it is possible to create one")
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("password has been hashed")
        const user = new User({
            email: userEmail,
            name: req.body.name,
            dateOfBirth: req.body.birthday,
            username: req.body.username,
            password: hashedPassword,
        })
        console.log("We created new user")
        const newUser = await user.save()
        console.log("successfully registered")
        const userFromUnverifiedDatabase = await UnverifiedUser.findOne({ email: userEmail})
        userFromUnverifiedDatabase.verified = true
        await userFromUnverifiedDatabase.save()
        console.log("user from unverified database got a property of verified ")
        res.redirect("/dashboard")
    } catch (error) {
        res.send(error)
    }
})

//not secure, possibility that user enters one wrong digit/the same otp. For now it is okay
function generateOTP() {
    const date = Date.now()
    const pin = date.toString().slice(-6)
    return pin
}

module.exports = router