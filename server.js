// // require('dotenv').config()

// // const app = require('./app');
// // const port = process.env.PORT;
// // const http = require('http');
// // const ws = require('ws');

// // // Create an HTTP server and start it on the specified port
// // const server = app.listen(port, () => {
// //     console.log(`Running on ${port}`);
// // });

// // CHANGED CODE

// require('dotenv').config();
// const http = require('http');
// const app = require('./app');
// const port = process.env.PORT || 3000;

// // Create an HTTP server for Express app
// const server = http.createServer(app);

// // Start the HTTP server
// server.listen(port,"192.168.100.6" ,() => {
//     console.log(`Server is running on port ${port}`);
// });

// // WebSocket server configuration
// const webSocketsServerPort = 3000;
// const webSocketServer = require('websocket').server;

// // Create a WebSocket server
// const wsServer = new webSocketServer({
//     httpServer: server
// });

// // Object to store connected clients
// const clients = {};

// // Function to generate unique user IDs
// const getUniqueID = () => {
//     const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     return s4() + s4() + '-' + s4();
// };

// // Handle WebSocket requests
// wsServer.on('request', function(request) {
//     const userID = getUniqueID();
//     console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');
  
//     // Accept the connection from any origin
//     const connection = request.accept(null, request.origin);
//     clients[userID] = connection;
  
//     connection.on('message', function(message) {
//     if (message.type === 'utf8') {
//         console.log('Received Message: ', message.utf8Data);

//         // Broadcast message to all connected clients
//         const receivedData = JSON.parse(message.utf8Data);
//         for (const key in clients) {
//             clients[key].sendUTF(JSON.stringify({
//                 user: receivedData.user,
//                 msg: receivedData.msg
//             }));
//             // console.log('Sent Message to: ', clients[key]);
//         }
//     }
// });

// });


require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
const videoCallPort = 8000;

// Create an HTTP server for Express app
const server = http.createServer(app);

// Start the HTTP server
server.listen(port, "192.168.100.6", () => {
    console.log(`Server is running on port ${port}`);
});

// WebSocket server configuration
const webSocketServerPort = 3000;
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

// Socket.io server for video calling
const io = new Server(videoCallPort, {
    cors: true,
});


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on("room:join", (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
});
