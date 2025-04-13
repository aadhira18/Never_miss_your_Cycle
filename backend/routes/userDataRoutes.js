// backend/routes/userDataRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFile = path.join(__dirname, '../data/users.json');

// GET user data
router.get('/:username', (req, res) => {
  const { username } = req.params;
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ userData: user.data || null });
});

// POST user data
router.post('/', (req, res) => {
  const { username, cycleLength, lastPeriodDate, mood } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users[userIndex].data = { cycleLength, lastPeriodDate, mood };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ message: 'User data saved successfully' });
});

module.exports = router;
