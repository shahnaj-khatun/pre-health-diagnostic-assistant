const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        default: 'Medication'
    },
    time: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'taken'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Treatment', treatmentSchema);
