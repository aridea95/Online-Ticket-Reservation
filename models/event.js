const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please input the Title of the Event']
    },
    info: {
        type: String,
        required: [true, 'Input the info for the Event']
    },
    ticketCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
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