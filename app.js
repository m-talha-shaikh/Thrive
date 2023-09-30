const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const attachDb = require('./server/utils/dbMiddleware');

//Rquired Routes
const profileRouter = require('./server/routes/profileRoutes')

//Starting app
const app = express();

//Middlewares
app.use(helmet());
app.use(express.json({ limit: '100kb' }))
app.use(xss());

// Attach the database connection to all routes under '/api/v1'
app.use('/api/v1', attachDb);

//Routing Middlewares
app.use('/api/v1/profiles', profileRouter);

//404
app.all('*', (req, res, next) => {
    res.send("Error 404");
})

module.exports = app;

