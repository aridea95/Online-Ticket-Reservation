const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');
const Ticket =  require('./models/ticket');

const app = express();

app.use(bodyParser.json());

app.use('/api', graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                info: String!
                schedule: String!
                location: String!
            }

            type Ticket {
                _id: ID!
                ticketType: String!
                quota: Float!
                price: Float!

            }

            input EventInput {
                title: String!
                info: String!
                schedule: String!
                location: String!
            }

            input TicketInput {
                ticketType: String!
                quota: Float!
                price: Float!
            }

            type RootQuery {
                events: [Event!]!
                tickets: [Ticket!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createTicket(ticketInput: TicketInput): Ticket
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                .then(events => {
                    return events.map(event => {
                        return event;
                    });
                })
                .catch(err => {
                    throw err;
                });
            },
            
            createEvent: args => {
                return Event.findOne({ title: args.eventInput.title })
                    .then(event => {
                        if (event) {
                            throw new Error('Event Title Already Exist.');
                        }
                    })
                const event = new Event({
                    title: args.eventInput.title,
                    info: args.eventInput.info,
                    // price: +args.eventInput.price,
                    schedule: new Date(args.eventInput.schedule),
                    location: args.eventInput.location
                });
                return event
                    .save()
                    .then(result => {
                        console.log(result);
                        return result;
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                });
            },

            tickets: () => {
                return Ticket.find()
                .then(tickets => {
                    return tickets.map(ticket => {
                        return ticket;
                    });
                })
                .catch(err => {
                    throw err;
                });
            },

            createTicket: args => {
                const ticket = new Ticket({
                    ticketType: args.ticketInput.ticketType,
                    quota: +args.ticketInput.quota,
                    price: +args.ticketInput.price
                });
                return ticket
                    .save()
                    .then(result => {
                        console.log(result);
                        return result;
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    })
            }
        },
        graphiql: true
    })
);

mongoose.connect(`mongodb+srv://ari-admin:admin@cluster0.tdrzz.mongodb.net/Online-Ticket-Reservation?retryWrites=true&w=majority`, {useUnifiedTopology: true}, {useNewUrlParser: true})
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
