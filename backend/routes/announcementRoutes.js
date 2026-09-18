const express = require("express");

const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

const announcementController =
  require("../controllers/announcementController");

const router = express.Router();


// นักศึกษาและอาจารย์ดูประกาศได้
router.get(
  "/",
  auth,
  announcementController.getAll
);


// ดูประกาศรายตัว
router.get(
  "/:id",
  auth,
  announcementController.getById
);


// อาจารย์สร้าง
router.post(
  "/",
  auth,
  allowRoles("advisor"),
  announcementController.create
);


// อาจารย์แก้ไข
router.put(
  "/:id",
  auth,
  allowRoles("advisor"),
  announcementController.update
);


// อาจารย์ลบ
router.delete(
  "/:id",
  auth,
  allowRoles("advisor"),
  announcementController.remove
);


module.exports = router;