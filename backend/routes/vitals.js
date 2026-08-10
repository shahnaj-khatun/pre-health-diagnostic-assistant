const express = require('express');
const router = express.Router();
const Vital = require('../models/Vital');
const auth = require('../middleware/auth');

// Add new vitals
router.post('/', auth, async (req, res) => {
    try {
        const { bloodPressure, heartRate, temperature } = req.body;

        const newVital = new Vital({
            user: req.user.id,
            bloodPressure,
            heartRate,
            temperature
        });

        const savedVital = await newVital.save();
        res.json(savedVital);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get latest vitals
router.get('/latest', auth, async (req, res) => {
    try {
        const latestVital = await Vital.findOne({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(latestVital);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all vitals history
router.get('/history', auth, async (req, res) => {
    try {
        const vitals = await Vital.find({ user: req.user.id }).sort({ timestamp: 1 }); // Ascending for graphs
        res.json(vitals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
