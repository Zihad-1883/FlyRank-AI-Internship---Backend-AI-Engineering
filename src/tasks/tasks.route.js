const express = require("express");
const router = express.Router();

const { getAllTasks, getSingleTask } = require("./tasks.controller");

router.get("/", getAllTasks);
router.get("/:id", getSingleTask);

module.exports = router;
