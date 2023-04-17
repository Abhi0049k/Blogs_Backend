const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "User",
        enum: ["User"]
    }
},{
    versionKey: false
})


const userModel = mongoose.model("user", userSchema);

userModel.createIndexes({email: 1});

module.exports = {
    userModel
}
