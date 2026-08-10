const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');


router.post('/', auth, async (req, res) => {
    const { doctorId, doctorName, date, time, reason } = req.body;

    try {
        const newAppointment = new Appointment({
            userId: req.user.id,
            doctorId,
            doctorName,
            date,
            time,
            reason
        });

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        
        // Make sure user owns appointment
        if (appointment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
