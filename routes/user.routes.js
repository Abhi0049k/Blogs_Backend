const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');
const { blacklistModel } = require('../models/blacklist.model');

const userRouter = express.Router();

userRouter.post('/register', async (req, res)=>{
    const data = req.body;
    try{
        let list = await userModel.findOne({email: data.email});
        if(list){
            return res.status(400).send({msg: "email id is already in use"});
        }
        data.password = bcrypt.hashSync(data.password, Number(process.env.SALT_ROUNDS))
        const newUser = await userModel(data);
        await newUser.save();
        console.log(newUser);
        res.status(200).send({msg: "user id created"});
    }catch(err){
        res.status(500).send({msg: err.message});
    }
})

userRouter.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email: email});
        const result = bcrypt.compareSync(password, user.password);
        if(result){
            const access_token = jwt.sign({'userId': user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '60s'});
            const refresh_token = jwt.sign({'userId': user._id}, process.env.REFRESH_SECRET_KEY, {expiresIn: '180s'});
            res.cookie("access_token", access_token, {
                maxAge: 60000
            });
            res.cookie("refresh_token", refresh_token, {
                maxAge: 180000
            });
            res.status(200).send({msg: 'Login Successful'});
        }
        else
        res.status(400).send({msg: 'Wrong Credentials'});
    }catch(err){
        res.status(500).send({msg: err.message});
    }
})

userRouter.get('/logout', async(req, res)=>{
    try{
        const {access_token, refresh_token} = req.cookies;
        const newblacklistedAccess_token = new blacklistModel({token: access_token});
        const newblacklistedRefresh_token = new blacklistModel({token: refresh_token});
        await newblacklistedAccess_token.save();
        await newblacklistedRefresh_token.save();
        res.status(200).send({msg: "Logout Successful"});
    }catch(err){
        res.status(500).send({msg: err.message});
    }
})

userRouter.get('/refresh-route', async (req, res)=>{
    try{
        const {refresh_token} = req.cookies;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY);
        if(!decoded)
        return res.status(400).send({msg: "Login Again"});
        const user = await userModel.findById({_id: decoded.userId});
        const newAccessToken = jwt.sign({"userId": user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '60s'});
        const newRefreshToken = jwt.sign({"userId": user._id}, process.env.REFRESH_SECRET_KEY, {expiresIn: '180s'});
        res.cookie("access_token", newAccessToken);
        res.cookie("refresh_token", newRefreshToken);
        res.status(200).send({msg: "A new set of tokens generated"})
    }catch(err){
        res.status(500).send({msg: err.message});
    }
})

module.exports = {
    userRouter
}
