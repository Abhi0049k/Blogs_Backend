const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    creator_email: {
        type: String,
        required: true
    }
},{
    versionKey: false
});

const blogModel = mongoose.model("blog",blogSchema);

module.exports = {
    blogModel
}