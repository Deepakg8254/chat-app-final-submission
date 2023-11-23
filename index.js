// index.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const onlineUsers = new Set(); // Use a Set to store unique user names

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Prompt the user for a name and emit the online users list
  const userName = prompt('Please enter your name:');
  onlineUsers.add(userName);
  io.emit('online users', Array.from(onlineUsers));

  socket.on('disconnect', () => {
    console.log('user disconnected');
    onlineUsers.delete(userName);
    io.emit('online users', Array.from(onlineUsers));
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
