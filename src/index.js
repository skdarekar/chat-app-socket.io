const path = require('path');
const http = require('http')
const socketio = require('socket.io');
const express = require('express');
const Filter = require('bad-words');
const { generateMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

let welcomeMsg = "Welcome to chat app!!";
io.on('connection', (socket) => {
    console.log("New WebSocket Connection!");
    socket.emit("newMessage", generateMessage(welcomeMsg));
    socket.broadcast.emit('newMessage', generateMessage("A new user has joined!"));

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback("Bad words not allowed!");
        }
        io.emit("newMessage", generateMessage(message));
        callback();
    })

    socket.on("sendLocation", (location, callback) => {
        socket.broadcast.emit("locationMessage", `https://google.com/maps?q=${location.longitude},${location.latitude}`)
        callback();
    })

    socket.on("disconnect", () => {
        io.emit("newMessage", generateMessage("A user has left!"));
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})