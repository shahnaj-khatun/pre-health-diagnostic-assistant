const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Optional seeding logic internal to route for demo purposes
const defaultDoctors = [
    { name: 'Dr. Sarah Tripathi', specialty: 'General Practitioner', available: true },
    { name: 'Dr. Mark Davis', specialty: 'Cardiologist', available: true },
    { name: 'Dr. Amir Khan', specialty: 'Dermatologist', available: true },
    { name: 'Dr. K.K. Agrawal', specialty: 'Pediatrician', available: true },
    { name: 'Dr. Anjali Sharma', specialty: 'Neurologist', available: true }
];

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Ensure all doctors are available as requested
        await Doctor.updateMany({ name: 'Dr. K.K. Agrawal' }, { available: true });
        
        let doctors = await Doctor.find();
        
        // Seed default doctors if DB is empty
        if (doctors.length === 0) {
            await Doctor.insertMany(defaultDoctors);
            doctors = await Doctor.find();
        }

        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
