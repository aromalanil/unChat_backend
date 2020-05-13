if (process.env.ENVIRONMENT != 'Production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Routes/user');
const messageRouter = require('./Routes/message');
const apiDetails = require('./apiDetails');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully"))
    .catch(error => console.log("ERROR : Database Connection Failed", error));

app.get('/', (req, res) => {
    res.json(apiDetails)
});

app.use('/user', userRouter);
app.use('/message',messageRouter);

app.use((req,res,next)=>{
    const err = new Error("Not Found");
    err.http_code=404;
    next(err);
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.json({
        error: err.message,
        status:err.status
    })
})


const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, console.log(`Server running on port : ${PORT}`))