const express = require("express");
const router = express.Router();
const statsRouter = express.Router();

const {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("./tasks.controller");

router.get("/", getAllTasks);
router.get("/:id", getSingleTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
statsRouter.get("/", getTaskStats);

module.exports = { router, statsRouter };
