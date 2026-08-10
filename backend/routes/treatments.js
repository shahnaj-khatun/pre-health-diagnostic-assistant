const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Treatment = require('../models/Treatment');

// @route   GET /api/treatments
// @desc    Get all treatments for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const treatments = await Treatment.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(treatments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/treatments
// @desc    Add a new treatment
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, type, time, instructions } = req.body;

    try {
        const newTreatment = new Treatment({
            userId: req.user.id,
            name,
            type,
            time,
            instructions
        });

        const treatment = await newTreatment.save();
        res.json(treatment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/treatments/:id
// @desc    Update treatment status (taken/pending)
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    try {
        let treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({ msg: 'Treatment not found' });
        }

        // Make sure user owns treatment
        if (treatment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        treatment = await Treatment.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );

        res.json(treatment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/treatments/:id
// @desc    Delete a treatment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({ msg: 'Treatment not found' });
        }

        // Make sure user owns treatment
        if (treatment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Treatment.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Treatment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
