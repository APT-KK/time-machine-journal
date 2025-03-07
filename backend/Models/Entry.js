const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
        title: {
            required: true,
            type: String
        },
        content: {
            required: true,
            type: String
        },
        date: {
            type: Date,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        mood: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
            default: 0.5
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }

    } , {timestamps: true});

    const Entry = mongoose.model('Entry', EntrySchema);

    module.exports = Entry;