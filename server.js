const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Routes/user');
const messageRouter = require('./Routes/message');
const apiDetails = require('./apiDetails');
const cors = require('cors');

if (process.env.ENVIRONMENT != 'Production')  //Only Required for Development Environment
{
    require('dotenv').config();
}

const app = express();

//Enabling Cross Origin requests
app.use(cors());

//Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Database Connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully"))
    .catch(error => console.log("ERROR : Database Connection Failed", error));


//Sending API details as index
app.get('/', (req, res) => {
    res.json(apiDetails)
});


//Routes
app.use('/user', userRouter);
app.use('/message', messageRouter);


//Error Handling
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.http_code = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: err.message,
        status: err.status
    })
})


//Server starting
const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, console.log(`Server running on port : ${PORT}`))