const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }))
app.use(xss());

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res, next) => {
    res.send("Working")
})

app.all('*', (req, res, next) => {
    res.send("Error 404");
})

module.exports = app;

