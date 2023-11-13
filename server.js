const app = require('./app');
const port = process.env.PORT || 3000;
const http = require('http');
const ws = require('ws');

// Create an HTTP server and start it on the specified port
const server = app.listen(port, () => {
    console.log(`Running on ${port}`);
});

