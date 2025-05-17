const express = require('express');
const router = express.Router();
const Period = require('../model/periodmodel');

router.post('/track-period', async (req, res) => {
  try {
    console.log("POST Call",req.body)
    const { startDate, periodLength, cycleLength } = req.body;

    if (!startDate || !periodLength || !cycleLength) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const start = new Date(startDate);
    const nextPeriodDate = new Date(start);
    nextPeriodDate.setDate(start.getDate() + parseInt(cycleLength));

    const formattedNext = nextPeriodDate.toISOString().split('T')[0];

    // Save to DB
    const periodEntry = new Period({
      username: req.user?.username || 'guest',
      startDate,
      periodLength,
      cycleLength,
      nextPeriod: formattedNext
    });

    await periodEntry.save();

    // Optional: Fetch past history
    const history = await Period.find({ username: req.user?.username || 'guest' }).sort({ createdAt: -1 }).limit(10);

    res.json({
      message: 'Period tracked successfully.',
      nextPeriod: formattedNext,
      history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not track period.' });
  }
});

module.exports = router;
