const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', require('./routes/graphql'));

module.exports = app;