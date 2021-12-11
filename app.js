require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var http = require('http')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo');
// const server = require('./bin/www');
// const socket = require('socket.io');
const cors = require('cors');

var Room = require('./models/room');
var Message = require('./models/message');
var mongoose = require('mongoose');
const User = require('./models/user');

var messageRouter = require('./routes/message');
var commentRouter = require('./routes/comment');
var postRouter = require('./routes/post');
var userRouter = require('./routes/user/user')
var signinRouter = require('./routes/user/signin');
var registerRouter = require('./routes/user/register');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(expressSession( {
  secret: 'secret',
  // store: MongoStore.create({mongoUrl: 'mongodb://localhost/meowsocial'})
}))

app.use(
  cors({
    origin: "*",
    methods: ["POST","GET","DELETE","PUT"]
  })
)

app.use('/message', messageRouter);
app.use('/post/comment', commentRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/signin', signinRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

io.on('connection', socket => {
  //user send message
  socket.on('send-msg', (message, sender, room) => {
    const temp = room.split('!@!@2@!@!').reverse().join('!@!@2@!@!');
    Room.findOne({roomName: [temp, room]}, (err, roomFound) => {
      if(roomFound) {
        const newMsg = Message.create({
          from: sender._id,
          message: message,
          roomId: roomFound._id
        })
        socket.to(roomFound.roomName)
          .emit('receive-msg', message, sender)
      }
    })

  })
  //user join room
  socket.on('join-room', data => {
    const temp = data.room.split('!@!@2@!@!').reverse().join('!@!@2@!@!');

    Room.findOne({roomName: [temp, data.room]}, (err, room) => {
      if(room) {
        socket.join(room.roomName)
        socket.emit('join-room', room.roomName)
      } else {
        const newRoom = Room.create({
          roomName: data.room
        })
        socket.join(newRoom.roomName)
        socket.emit('join-room', newRoom.roomName)
      }
    });

  })
})

const PORT = 8080;

server.listen(
  PORT,
  () => console.log(`Server is running at port ${PORT}`)
)
