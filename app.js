const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/api', graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                info: String!
                price: Float!
                schedule: String!
            }

            input EventInput {
                title: String!
                info: String!
                price: Float!
                schedule: String!
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
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    info: args.eventInput.info,
                    price: +args.eventInput.price,
                    schedule: args.eventInput.schedule
                };
                events.push(event);
                return event;
            }
        },
        graphiql: true
    })
);

app.listen(3000);