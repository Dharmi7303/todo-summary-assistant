// server/routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// POST summarize todos and send to Slack
router.post('/summarize', summaryController.summarizeAndSend);

module.exports = router;