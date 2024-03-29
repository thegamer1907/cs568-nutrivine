require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {Message} = require("./model.js");

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

mongoose.set("strictQuery", true);
mongoose.connect(`${process.env.MONGO_URL}`, { dbName: "nutrivine" })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let server = app.listen(3000);

let io = require('socket.io')(server,{
  cors: {
    origin: "*"
  }
});

const sockets = {};

io.on('connection', (socket) => {
  socket.on('register_user', (data) => {
    sockets[`${data.chat_id}_${data.from}`] = socket;
    console.log('User registered', data);
    console.log('from', data.from);
    if(`${data.chat_id}_${data.to}` in sockets){
      console.log('User online', data);
      sockets[`${data.chat_id}_${data.to}`].emit('user_online', data);
      sockets[`${data.chat_id}_${data.from}`].emit('user_online', data);
    }
  });

  socket.on('send_message', async (data) => {
    console.log('Message received', data);
    const {to, from, message, chat_id, type, timestamp} = data;
    const messageData = {
      chat_id,
      from,
      to,
      message,
      type,
      timestamp
    };
    const newMessage = new Message(messageData);
    await newMessage.save();
    if(`${chat_id}_${to}` in sockets){
      sockets[`${chat_id}_${to}`].emit('new_message', messageData);
    }
  });

  socket.on('disconnect', () => {
    for (const key in sockets) {
      if (Object.hasOwnProperty.call(sockets, key)) {
        const element = sockets[key];
        if(element === socket){
          delete sockets[key];
        }
      }
    }
  });
});

module.exports = app;
