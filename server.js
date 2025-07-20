const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');

const formatMessage = require('./code/message');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    roomUsers
} = require('./code/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;
const botName = 'Hanasō!';

// Serve static files from 'code' folder
app.use(express.static(path.join(__dirname, 'code')));

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// When client connects
io.on('connection', socket => {

    // User joins room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome the current user
        socket.emit('message', formatMessage(botName, `Welcome to the chat, ${user.username}`));

        // Notify others in the room
        socket.broadcast.to(user.room).emit('message',
            formatMessage(botName, `${user.username} has joined the chat`)
        );

        // Send room and users info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: roomUsers(user.room)
        });
    });

    // Listen for chat message
    socket.on('user-message', msg => {
        const user = getCurrentUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
    });

    // When client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Update user list in room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: roomUsers(user.room)
            });
        }
    });
});
