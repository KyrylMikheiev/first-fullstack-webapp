const express = require("express")
const router = express.Router()
const User = require("../../models/user")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")

router.post("/", async(req, res) => {
    const { email } = req.body
    const { password } = req.body

    try {
        const user = await User.findOne({ email: email})
        if (user) {
            const hashedPassword = user.password
            if (await bcrypt.compare(password, hashedPassword)) {
                console.log("Successfully logged in")
                return res.redirect("/dashboard")
            } else {
                return res.send("wrong password, try again")
            }
        } else {
            return res.send("There is no such user")
        }
    } catch (error) {
        res.send(error)
    }
})

router.post("/forgot-password", async(req, res) => {
    const { email } = req.body
    const userEmail = email
    const otpCode = generateOTP()

    let MailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "Mailgen",
            link: "https://mailgen.js/"
        }
    })
    
    let response = {
        body: {
            name: userEmail,
            // example
            table: {
                data: [
                    {
                        item: "Your verification code",
                        description: otpCode,
                    }
                ]
            },
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
                oldUser.otp = otpCode
                oldUser.codeCreationDate = Date.now()
                oldUser.codeExpirationDate = Date.now() + 10 * 60 * 1000
                await oldUser.save()
        } else {
            return res.send("There is no such user")
        }
        await transporter.sendMail(message)
        console.log("Email (forgot password) was send to the user")
        const encodedEmail = encodeURIComponent(userEmail);
        return res.redirect(`/login/verification?email=${encodedEmail}`);
    } catch (error) {
        res.send(error)
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
            // console.log("Expiration date", user.codeExpirationDate.getTime())
            // console.log("now", Date.now())
            if (user.codeExpirationDate.getTime() > Date.now()) {
                if (user.otp.toString() === code.toString()) {
                    // user.verified = true
                    // await user.save()
                    console.log("Inputed OTP was right, allowed to change password")
                    res.redirect(`/login/change-password?email=${encodeURIComponent(email)}`)
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
        
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post("/change-password", (req, res) => {
    res.send("Perfect")
})


function generateOTP() {
    const date = Date.now()
    const pin = date.toString().slice(-6)
    return pin
}

module.exports = router