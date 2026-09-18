const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.get('/student/:studentId', auth, activityController.getByStudent);
router.post('/', auth, allowRoles('student', 'advisor'), activityController.create);
router.put('/:id', auth, allowRoles('student', 'advisor'), activityController.update);
router.delete('/:id', auth, allowRoles('student', 'advisor'), activityController.remove);

module.exports = router;