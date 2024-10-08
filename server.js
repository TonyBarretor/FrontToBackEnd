const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/emailproject');

// User model
const User = require('./models/user');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create a transporter object using SMTP transport (Gmail in this case)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API endpoint to get users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// API endpoint to create a user and send a welcome email
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();

    // Send a welcome email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Welcome to Our Service!',
        text: `Hi ${user.name},\n\nWelcome to our service! We are glad to have you.\n\nBest regards,\nYour Company`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });

    res.status(201).json(user);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
