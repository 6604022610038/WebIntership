const express = require('express');
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/student/:studentId', auth, notificationController.getByStudent);
router.put('/:id/read', auth, notificationController.markRead);
router.put('/student/:studentId/read-all', auth, notificationController.markAllReadForStudent);
router.put('/advisor/read-all', auth, notificationController.markAllReadForAdvisor);

module.exports = router;
