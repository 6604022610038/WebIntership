const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/conversations', auth, allowRoles('advisor'), messageController.getConversations);
router.get('/unread-count', auth, messageController.getUnreadCount);
router.get('/:studentId', auth, messageController.getThread);
router.post('/', auth, messageController.send);

module.exports = router;