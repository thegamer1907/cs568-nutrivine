var express = require('express');
var router = express.Router();
const {preferences, Chat, Message, User_Preference} = require("./../model.js");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/user_preferences/:user', async function(req, res, next) {
  const {user} = req.params;
  const user_preferences = await User_Preference.find({user});
  res.send(user_preferences)
});

router.post('/user_preferences', async function(req, res, next) {
  const {user, preferences} = req.body;
  const user_preference = new User_Preference({user, preferences});
  await user_preference.save();
  res.send(user_preference);
});

router.get('/preferences', async function(req, res, next) {
  const questions = await preferences.find({});
  res.send(questions)
});

router.post('/start_chat', async function(req, res, next) {
  const {user} = req.body;
  const chat = new Chat({user});
  await chat.save();
  res.send({"_id": chat.id})
});

router.get('/chats/:user', async function(req, res, next) {
  const {user} = req.params;
  if(user === 'admin'){
    const chats = await Chat.find({});
    res.send(chats)
    return;
  }
  const chats = await Chat.find({user});
  res.send(chats)
});

router.get('/messages/:chat_id', async function(req, res, next) {
  const {chat_id} = req.params;
  const messages = await Message.find({chat_id});
  const chat = await Chat.findById(chat_id);
  const preferences = await User_Preference.find({user: chat.user});
  console.log(preferences)
  res.send({messages : messages, preferences: preferences[0].preferences})
});

module.exports = router;
