const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: {
  type: String,
  default: "",
},

  sender: {
    type: String,
    required: true,
  },

  time: {
    type: String,
  },

  receiver: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model(
  "Message",
  messageSchema
);