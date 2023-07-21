const path = require('path');
const http = require('http')
const socketio = require('socket.io');
const express = require('express');

const app = express()
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath))

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

let welcomeMsg = "Welcome to chat app!!";
io.on('connection', (socket) => {
    console.log("New WebSocket Connection!");
    socket.emit("newMessage", welcomeMsg);
    socket.broadcast.emit('newMessage', "A new user has joined!");

    socket.on("sendMessage", (message) => {
        console.log("New message received!", message);
        io.emit("newMessage", message);
    })

    socket.on("sendLocation", (location) => {
        console.log("Location received!", location);
        socket.broadcast.emit("newMessage", `https://google.com/maps?q=${location.longitude},${location.latitude}`)
    })

    socket.on("disconnect", ()=>{
        io.emit("newMessage", "A user has left!")
    })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})