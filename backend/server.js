// backend/server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve static public files (like images)
app.use('/public', express.static(path.join(__dirname, '../public')));

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
