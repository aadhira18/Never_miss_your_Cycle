// backend/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const donateRoutes = require('./routes/donateRoutes');
const userDataRoutes = require('./routes/userDataRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/periodTrackerDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// ✅ Static Frontend Files
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Serve images from public/image/
app.use('/image', express.static(path.join(__dirname, '../public/image')));

// ✅ Serve CSS & JS from frontend
app.use('/style', express.static(path.join(__dirname, '../frontend')));
app.use('/script', express.static(path.join(__dirname, '../frontend')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donate', donateRoutes);
app.use('/api/userdata', userDataRoutes);

// ✅ Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Dashboard Page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// ✅ Dynamic Pages Handler
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, `../frontend/${page}.html`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('❌ Page not found');
    } else {
      res.sendFile(filePath);
    }
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
