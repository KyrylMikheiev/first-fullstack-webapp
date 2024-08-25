const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true, 
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    verified: Boolean,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        //prehook in server.js (replace method for deleting spacing) (middleware)
        type: String, 
        required: true,
        trim: true,
    },
    dateOfAccoutCreation: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model("User", userSchema)