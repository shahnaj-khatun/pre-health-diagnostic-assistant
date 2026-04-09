const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: [{
        type: String,
        required: true
    }],
    diagnosis: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'low'
    },
    recommendations: [String],
    aiResponse: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Symptom', symptomSchema);
