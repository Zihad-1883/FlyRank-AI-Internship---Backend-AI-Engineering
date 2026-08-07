const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
} = require("./tasks.controller");

router.get("/", getAllTasks);
router.get("/:id", getSingleTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
