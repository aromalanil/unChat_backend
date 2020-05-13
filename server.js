if (process.env.ENVIRONMENT != 'Production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Routes/user')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully"))
    .catch(error => console.log("ERROR : Database Connection Failed", error));

app.get('/', (req, res) => {
    res.send("Hello")
});

app.use('/user', userRouter);


const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, console.log(`Server running on port : ${PORT}`))