const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        await user.save();

       
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
