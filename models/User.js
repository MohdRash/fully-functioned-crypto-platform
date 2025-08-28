const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  wallet: {
    usd: {
      type: Number,
      default: 10000 // Starting USD balance
    },
    btc: {
      type: Number,
      default: 0 // Starting BTC balance
    }
  }
});

module.exports = mongoose.model('User', UserSchema);