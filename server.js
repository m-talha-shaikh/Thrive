// require('dotenv').config()

// const app = require('./app');
// const port = process.env.PORT;
// const http = require('http');
// const ws = require('ws');

// // Create an HTTP server and start it on the specified port
// const server = app.listen(port, () => {
//     console.log(`Running on ${port}`);
// });

// CHANGED CODE

require('dotenv').config();
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

// Create an HTTP server for Express app
const server = http.createServer(app);

// Start the HTTP server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// WebSocket server configuration
const webSocketsServerPort = 3000;
const webSocketServer = require('websocket').server;

// Create a WebSocket server
const wsServer = new webSocketServer({
    httpServer: server
});

// Object to store connected clients
const clients = {};

// Function to generate unique user IDs
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

// Handle WebSocket requests
wsServer.on('request', function(request) {
    const userID = getUniqueID();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');
  
    // Accept the connection from any origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
  
    connection.on('message', function(message) {
    if (message.type === 'utf8') {
        console.log('Received Message: ', message.utf8Data);

        // Broadcast message to all connected clients
        const receivedData = JSON.parse(message.utf8Data);
        for (const key in clients) {
            clients[key].sendUTF(JSON.stringify({
                user: receivedData.user,
                msg: receivedData.msg
            }));
            // console.log('Sent Message to: ', clients[key]);
        }
    }
});

});