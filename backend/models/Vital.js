const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodPressure: {
        systolic: {
            type: Number,
            required: true
        },
        diastolic: {
            type: Number,
            required: true
        }
    },
    heartRate: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vital', vitalSchema);
