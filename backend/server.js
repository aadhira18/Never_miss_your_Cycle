// backend/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const donateRoutes = require('./routes/donateRoutes');
const userDataRoutes = require('./routes/userDataRoutes');
const periodsRoutes = require('./routes/periodRoutes')

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
// ✅ MongoDB Connection
//Replace the below with your actual MongoDB Atlas connection string
const mongoURI = "mongodb+srv://aadhira1:aadhira1@cluster0.lmcqh5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas successfully');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});


// ✅ Static Frontend Files
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Serve images from public/image/
app.use('/image', express.static(path.join(__dirname, '../public/image')));

// ✅ Serve CSS & JS from frontend
app.use('/Style', express.static(path.join(__dirname, '../frontend')));
app.use('/script', express.static(path.join(__dirname, '../frontend')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donate', donateRoutes);
app.use('/api/userdata', userDataRoutes);
app.use('/api/periods', periodsRoutes);

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