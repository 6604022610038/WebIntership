const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const upload = require('../middleware/upload');
const weeklyReportController = require('../controllers/weeklyReportController');

const router = express.Router();

router.get('/student/:studentId', auth, weeklyReportController.getByStudent);
router.get('/', auth, allowRoles('advisor'), weeklyReportController.getAll);
router.get('/report/:id', auth, weeklyReportController.getById);
router.post('/', auth, allowRoles('student'), upload.array('attachments', 5), weeklyReportController.create);
router.put('/:id/approve', auth, allowRoles('advisor'), weeklyReportController.approve);
router.put('/:id/reject', auth, allowRoles('advisor'), weeklyReportController.reject);
router.put('/:id', auth, allowRoles('student'), upload.array('attachments', 5), weeklyReportController.update);
router.delete('/:id', auth, allowRoles('student'), weeklyReportController.remove);

module.exports = router;