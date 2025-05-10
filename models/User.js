const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userKey: { type: String, unique: true },
  lastOnline: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
