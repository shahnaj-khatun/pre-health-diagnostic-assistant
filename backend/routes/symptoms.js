const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Symptom = require('../models/Symptom');


router.post('/', auth, async (req, res) => {
    try {
        const { symptoms, diagnosis, urgency, recommendations, aiResponse } = req.body;

        const newSymptom = new Symptom({
            userId: req.user.id,
            symptoms,
            diagnosis,
            urgency,
            recommendations,
            aiResponse
        });

        const symptomRecord = await newSymptom.save();
        res.json(symptomRecord);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const history = await Symptom.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
