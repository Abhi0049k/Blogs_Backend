const express = require('express');
const cookieParser = require('cookie-parser');
const { connection } = require('./configs/db');
const { userRouter } = require('./routes/user.routes');
const { blogRouter } = require('./routes/blog.routes');
require('dotenv').config();


const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("evaluation 02");
})

app.use('/user', userRouter);
app.use('/blog', blogRouter)


app.listen(process.env.PORT, ()=>{
    connection();
    console.log(`App is running on port: ${process.env.PORT}`)
})