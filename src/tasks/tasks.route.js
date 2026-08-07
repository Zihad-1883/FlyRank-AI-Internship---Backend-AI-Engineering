const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getSingleTask,
  createTask,
} = require("./tasks.controller");

router.get("/", getAllTasks);
router.get("/:id", getSingleTask);

router.post("/", createTask);

module.exports = router;
