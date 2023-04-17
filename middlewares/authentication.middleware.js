const jwt = require('jsonwebtoken');

const { userModel } = require("../models/user.model");

const authenticate = async(req, res, next)=>{
    try{
        const {access_token, refresh_token} = req.cookies;
        const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
        if(decoded){
            const user = await userModel.findById({_id: decoded.userId});
            if(user){
                req.body['role'] = user.role;
                req.body["creator_email"]=  user.email;
                next();
            }
            else
            res.status(400).send({msg: "Login Again"});
        }else{
            res.status(400).send({msg: "Login Again"});
        }
    }catch(err){
        res.status(500).send({msg: err.message});
    }
}


module.exports = {
    authenticate
}