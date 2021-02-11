const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/api', graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                info: String!
                price: Float!
                schedule: String!
                location: String!
            }

            input EventInput {
                title: String!
                info: String!
                price: Float!
                schedule: String!
                location: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
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
                const event = new Event({
                    title: args.eventInput.title,
                    info: args.eventInput.info,
                    price: +args.eventInput.price,
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
