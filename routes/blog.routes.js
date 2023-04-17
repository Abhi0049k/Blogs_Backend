const express = require('express');
const { blogModel } = require('../models/blog.model');
const { authenticate } = require('../middlewares/authentication.middleware');
const { blacklist } = require('../middlewares/blacklist.middleware');

const blogRouter = express.Router();

blogRouter.get('/read', blacklist, authenticate, async (req, res)=>{
    try{
        const blogs = await blogModel.find();
        res.status(200).send(blogs);
    }catch(err){
        res.status(500).send({msg: err.message});
    }
})

blogRouter.post('/add', blacklist, authenticate, async(req, res)=>{
    try{
        const blog = req.body;
        const newBlog = new blogModel(blog);
        await newBlog.save();
        res.status(200).send({msg: "blog Posted"});
    }catch(err){
        res.status(400).send({msg: err.message});
    }
})

blogRouter.patch('/update-blog/:id', blacklist, authenticate, async(req, res)=>{
    const {id} = req.params
    console.log(id);
    try{
        const {title, desc, creator_email} = req.body;
        const blog = await blogModel.findById(id);
        if(blog.creator_email == creator_email){
            await blogModel.findOneAndUpdate({_id: id},{title, desc});
            res.status(200).send({msg: "Blog Updated"});
        }else{
            res.status(400).send({msg: "You Cannot update someone else post"});
        }
    }catch(err){
        res.status(500).send({msg: err.message});
    }
})

blogRouter.delete('/delete-blog/:id', blacklist, authenticate, async(req, res)=>{
    try{
        const {id} = req.params
        const {creator_email, role} = req.body;
        const blog = await blogModel.findById(id);
        if(blog.creator_email === creator_email){
            await blogModel.findOneAndDelete({_id: id});
            res.status(200).send({msg: "Blog Deleted"});
        }else if(role==='Moderator'){
            await blogModel.findOneAndDelete({_id: id});
            res.status(200).send({msg: "Blog Deleted"});
        }else{
            res.status(400).send({msg: "You Cannot delete someone else post"});
        }
    }catch(err){
        res.status(500).send({msg: err.message});
    }

})

module.exports = {
    blogRouter
}