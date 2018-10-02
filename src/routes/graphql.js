const graphqlHTTP = require('express-graphql');

const schema = require('../graphql/schema');

const router = require('express').Router();

router.all('/', graphqlHTTP({ schema, graphiql: true }));

module.exports = router;