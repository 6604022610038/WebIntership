const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const dailyReportController = require('../controllers/dailyReportController');

const router = express.Router();

router.get('/student/:studentId', auth, dailyReportController.getByStudent);
router.get('/', auth, allowRoles('advisor'), dailyReportController.getAll);
router.post('/', auth, allowRoles('student'), dailyReportController.create);
router.put('/:id', auth, dailyReportController.update);
router.put('/:id/review', auth, allowRoles('advisor'), dailyReportController.review);
router.delete('/:id', auth, allowRoles('student'), dailyReportController.remove);

module.exports = router;
