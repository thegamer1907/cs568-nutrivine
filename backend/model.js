const mongoose = require('mongoose');


const preferences = mongoose.model('preferences', new mongoose.Schema({}, { strict: false }));


module.exports = {
    preferences
};