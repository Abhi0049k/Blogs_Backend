const mongoose = require('mongoose');
require('dotenv').config();

const connection = async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log('Connection Established with the db')
    }catch(err){
        console.log('Connection with db fails to establish');
    }
}


module.exports = {
    connection
}