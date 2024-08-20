const mongoose = require("mongoose")

const unverifiedUserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        // unique: true,
        trim: true, 
        required: true,
    },
    verified: Boolean,
    otp: String,
    codeCreationDate: {
        type: Date,
        default: Date.now,  // Correctly set default to the current date/time
    },
    codeExperationDate: {
        type: Date,
        default: function() {
            return Date.now() + 10 * 60 * 1000;  // Set 10 minutes from the creation time
        }
    }
})

module.exports = mongoose.model("UnverifiedUser", unverifiedUserSchema)