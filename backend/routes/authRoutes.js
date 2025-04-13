const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // For secure password handling
const router = express.Router();

const usersFile = path.join(__dirname, '../data/users.json');

// ✅ Helper functions
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  writeUsers(users);
  res.status(201).json({ message: 'User registered successfully' });
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // ✅ Return success along with the username
  res.json({ message: 'Login successful', username });
});

module.exports = router;
