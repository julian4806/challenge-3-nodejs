const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const availableRooms = [
  'Chillout place',
  'Nightlife',
  'Series & Movies',
  'Sports'
]

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatBox Bot';

// Run when client connects
io.on('connection', socket => {
  socket.emit('available-rooms', availableRooms)
  socket.on('joinRoom', (username, room) => {
    if (!availableRooms.includes(room)) {
      socket.emit('message', formatMessage(botName, 'Welcome to ChatBox, All you need to do now is click on one of the rooms on the left to join one!'));
      return
    }
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome current user
    socket.emit('message', formatMessage(botName, `Welcome to ChatBox! You have now succesfully joined The <i>${room}</i> room`));
    socket.emit('join-room-change-color', room);
    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    io.emit('user-count', getRoomCount(room))
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    if (!user) return
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on: http://127.0.0.1:${PORT}/`));



// users
const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}


function getRoomCount(roomName) {
  const hashMap = {}
  const roomCount = [];

  for (var rooms of users) {
    if (rooms.room in hashMap) {
      hashMap[rooms.room] = hashMap[rooms.room] + 1;
    } else {
      hashMap[rooms.room] = 1;
    }
  }
  Object.keys(hashMap).forEach(key => {
    roomCount.push({
      key,
      count: hashMap[key]
    })
  })
  // return roomCount.find(x => x.key === roomName).count
  return hashMap
}
