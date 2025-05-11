const express = require('express');
const router = express.Router();
const { chatHandler, fetchHistory, clearSession } = require('../controllers/chatController');

router.post('/', chatHandler);
router.get('/history/:sessionId', fetchHistory);
router.delete('/history/:sessionId', clearSession);

module.exports = router;