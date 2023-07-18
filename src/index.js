const path = require('path');
const http = require('http')
const socketio = require('socket.io');
const express = require('express')

const app = express()
const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath))

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', (e) => {
    console.log("New WebSocket Connection!", e);
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})