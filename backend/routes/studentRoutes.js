const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const studentController = require('../controllers/studentController');

const router = express.Router();

router.get('/student-id/:studentId', auth, studentController.getByStudentId);
router.put('/student-id/:studentId', auth, studentController.updateByStudentId);
router.get('/', auth, allowRoles('advisor'), studentController.getAll);
router.get('/:id', auth, studentController.getById);
router.post('/', auth, allowRoles('advisor'), studentController.create);
router.put('/:id', auth, allowRoles('advisor'), studentController.updateById);
router.delete('/:id', auth, allowRoles('advisor'), studentController.deleteById);

module.exports = router;
