// backend/routes/donateRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const donationsFile = path.join(__dirname, '../data/donations.json');

router.post('/', (req, res) => {
  const donation = req.body;
  const donations = JSON.parse(fs.readFileSync(donationsFile, 'utf-8'));

  donations.push(donation);
  fs.writeFileSync(donationsFile, JSON.stringify(donations, null, 2));
  res.status(200).json({ message: 'Donation received! Thank you!' });
});

module.exports = router;
