const express = require('express');
const router = express.Router();
const { isMockDb } = require('../config/db');

// Route to check database status
router.get('/db-status', (req, res) => {
  const mongoose = require('mongoose');

  if (isMockDb()) {
    return res.status(200).json({
      success: true,
      message: 'Using mock in-memory database',
      status: 'mock',
      readyState: 'active'
    });
  } else if (mongoose.connection.readyState === 1) {
    return res.status(200).json({
      success: true,
      message: 'MongoDB connection is established',
      status: 'connected',
      readyState: mongoose.connection.readyState
    });
  } else {
    return res.status(503).json({
      success: false,
      message: 'Database connection is not established',
      status: 'disconnected',
      readyState: mongoose.connection.readyState
    });
  }
});

module.exports = router;
