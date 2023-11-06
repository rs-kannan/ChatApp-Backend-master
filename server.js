//Required Files to import to server
const express = require('express');
const connectDB = require('./Config/db');
const cors = require('cors');
const PORT = 5000 || process.env.PORT;
const app = express();
const dotenv = require('dotenv');
const authRouter = require('./Routes/routes');
const chatRoutes = require('./Routes/chatroutes');
const messageRoutes = require('./Routes/messageroutes');
const { notFound, errorHandler } = require('./Middleware/errorMiddelware');

//Configrations
dotenv.config();
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/user', authRouter);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//error handling
app.use(notFound);
app.use(errorHandler);

//Server Port Api
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    // credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
