const app = require('./app');
const port = process.env.PORT || 3000;
const http = require('http');
const ws = require('ws');

// Create an HTTP server and start it on the specified port
const server = app.listen(port, () => {
    console.log(`Running on ${port}`);
});

// Create a WebSocket server and attach it to the HTTP server
const wss = new ws.WebSocketServer({ server });

// Listen for WebSocket connections
wss.on('connection', (connection,req) => {
   
    // You can handle WebSocket connections here
console.log("cdifjei");
console.log(req.headers.cookie);
});
