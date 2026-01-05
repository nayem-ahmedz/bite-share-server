const express = require('express');
const User = require('../models/User');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');

const router = express.Router();

// create a user
router.post('/', verifyFirebaseToken, async (req, res) => {
    try {
        const { name, email, photoURL } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create a user
        const user = await User.create({
            name,
            email,
            photoURL: photoURL || '',
            role: 'user',
            status: 'active'
        });
        res.status(201).json({
            success: true,
            message: 'User is added',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to add user' });
    }
});

// get user role
router.get('/role', verifyFirebaseToken, async(req, res) => {
    const email = req.query.email;
    if(email !== req.tokenEmail){
        res.status(403).json({message: 'forbidden access'});
    }
    const user = await User.findOne({email: req.tokenEmail}).select('-__v');
    res.json({
        success: true,
        role: user ? user.role : 'user'
    });
});

// get profile of user
router.get('/profile', verifyFirebaseToken, async(req, res) => {
    const email = req.query.email;
    if(email !== req.tokenEmail){
        res.status(403).json({message: 'forbidden access'});
    }
    const user = await User.findOne({email: req.tokenEmail}).select('-__v');
    res.json({
        success: true,
        user: user ? user : 'user'
    });
});

module.exports = router;