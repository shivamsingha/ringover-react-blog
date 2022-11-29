const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use('/api/user', require('./api/routes/users.js'));
app.use('/api/entries', require('./api/routes/entries.js'));

module.exports = app