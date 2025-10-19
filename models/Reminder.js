const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
  sendTime: Date
});

module.exports = mongoose.model("Reminder", reminderSchema);
