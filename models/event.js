const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    schedule: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);