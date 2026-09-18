const express = require('express');

const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const formUpload = require('../middleware/formUpload');

const formController = require('../controllers/formController');

const router = express.Router();

// นักศึกษาและอาจารย์ดูรายการไฟล์ได้
router.get('/', auth, formController.getAll);

// อาจารย์อัปโหลดไฟล์/แบบฟอร์ม
router.post(
  '/upload',
  auth,
  allowRoles('advisor'),
  formUpload.single('file'),
  formController.upload
);

// อาจารย์ลบไฟล์
router.delete(
  '/:id',
  auth,
  allowRoles('advisor'),
  formController.remove
);

module.exports = router;