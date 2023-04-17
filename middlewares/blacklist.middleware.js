const { blacklistModel } = require("../models/blacklist.model");

const blacklist = async (req, res, next)=>{
    try{
        const {access_token} = req.cookies;
        const list = await blacklistModel.find({token: access_token});
        if(list.length!==0)
        res.status(400).send({msg: "Login Again"});
        else{
            next();
        }
    }catch(err){
        res.status(500).send({msg: err.message});
    }
}

module.exports = {
    blacklist
}
