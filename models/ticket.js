const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    eventTitle: [{type: Schema.Types.ObjectId, ref: 'Event'}],
    ticketType: {
        type: String,
        required: true
    },
    quota: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Ticket', ticketSchema)