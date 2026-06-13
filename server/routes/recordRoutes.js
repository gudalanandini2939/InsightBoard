const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

router.get("/", protect, getRecords);
router.post("/", protect, createRecord);
router.put("/:id", protect, updateRecord);
router.delete("/:id", protect, deleteRecord);

module.exports = router;