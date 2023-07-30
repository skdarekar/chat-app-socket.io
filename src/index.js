const path = require('path');
const http = require('http')
const socketio = require('socket.io');
const express = require('express');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

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

    // socket.emit, io.emit, socket.broadcast.emit
    // socket.to.emit, socket.broadcast.to.emit

    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit("newMessage", generateMessage("Admin", welcomeMsg));
        socket.broadcast.to(user.room).emit('newMessage', generateMessage("Admin", `${user.username} has joined!`));
        callback();
    })

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback("Bad words not allowed!");
        }
        const user = getUser(socket.id);
        if (user) {
            io.to(user.room).emit("newMessage", generateMessage(user.username, message));
            callback();
        }
    })

    socket.on("sendLocation", (location, callback) => {
        const user = getUser(socket.id)
        if(user){
            socket.broadcast.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://google.com/maps?q=${location.longitude},${location.latitude}`))
            callback();
        }
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.username} has left!`));
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})