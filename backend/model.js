const mongoose = require('mongoose');



const preferences = mongoose.model('preferences', new mongoose.Schema({}, { strict: false }));

const chatSchema = new mongoose.Schema({
    user: {
      type: String,
      required: true // Makes this field mandatory
    }
  }, { timestamps: true });
  
  
const Chat = mongoose.model('chats', chatSchema);

const messageSchema = new mongoose.Schema({
    chat_id: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
  });

const Message = mongoose.model('messages', messageSchema);


const user_preference = new mongoose.Schema({
    user: {
      type: String,
      required: true
    },
    preferences: {
      type: Array,
      required: true
    }
  });

const User_Preference = mongoose.model('user_preferences', messageSchema);



module.exports = {
    preferences,
    Chat,
    Message,
    User_Preference
};