const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  username: { type: String, required: true },
  startDate: { type: String, required: true },
  periodLength: { type: Number, required: true },
  cycleLength: { type: Number, required: true },
  nextPeriod: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Period', PeriodSchema);
