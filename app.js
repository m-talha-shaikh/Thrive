const express = require('express');
const helmet = require('helmet');
const cors = require(`cors`);
const attachDb = require('./server/utils/dbMiddleware');

//Rquired Routes
const personRouter = require('./server/routes/personRoutes')
const instituteRouter = require('./server/routes/instituteRoutes')
const organizationRouter = require('./server/routes/organizationRoutes')
const PostRoutes = require("./server/routes/posts");
const AuthRoutes = require("./server/routes/Auth")


//Starting app
const app = express();


//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json())

// Attach the database connection to all routes under '/api/v1'
app.use('/api/v1', attachDb);

//Routing Middlewares
app.use('/api/v1/persons', personRouter);
app.use('/api/v1/institutes', instituteRouter);
app.use('/api/v1/organizations', organizationRouter);
app.use("/api/v1/Auth",AuthRoutes);
//404
app.all('*', (req, res, next) => {
    res.send("Error 404");
})

module.exports = app;

