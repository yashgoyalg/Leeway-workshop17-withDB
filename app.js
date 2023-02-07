const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/users')

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }, () => { 
    console.log("DATABASE CONNECTED"); 
}); 
const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:")); 
db.once("open", function () {
     console.log("Connected to the database"); 
    });


//init server
const app = express();
app.use(express.json());

//GET method
app.get('/users', async (req, res) => {
    try {

        const users = await User.find()
        // res.json(users);
        console.log(users);
        res.send(users);

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//POST method
app.post('/users', async (req, res) => {
    try {
        const validate = await User.findOne({ username: req.body.username })
        console.log(validate, "invalid");
        if (!validate) {
            res.send("Invalid")
        }
        
            const user = new User({ username: req.body.username, password: req.body.password })
            await user.save();
            console.log("User Created");
            res.json(user);
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//DELETE Method
app.delete('/users', async (req, res) => {
    try {

        await User.deleteOne({ _id: req.body.id });
        console.log("User Deleted");
        res.send("User Deleted")


    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//PUT method
app.put('/users', async (req, res) => {
    try {

        await User.findByIdAndUpdate(req.body.id, {
            username: req.body.username,
            password: req.body.password
        });
        console.log("User Updated");
        const user = await User.find({ _id: req.body.id });
        console.log(user)
        res.send(user)

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//server
app.listen(3200, (req, res) => {
    console.log("listening on port 3200");
})
