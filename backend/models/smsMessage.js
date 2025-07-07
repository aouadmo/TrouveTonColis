const mongoose = require('mongoose');

const SmsMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'pros', unique: true, required: true },
  receptionMessage: String,
  reminderMessage: String,
  absentUrgentMessage: String,
  absentPlannedMessage: String,
});

 const SmsMessage = mongoose.model('smsMessage', SmsMessageSchema);

 module.exports = SmsMessage;
