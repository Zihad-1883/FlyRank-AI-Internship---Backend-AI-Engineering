const service = require("./tasks.service");

const getAllTasks = async (req, res) => {
  const tasks = await service.getAllTasks();
  res.json(tasks);
};

const getSingleTask = async (req, res) => {
  const id = req.params.id;
  const task = await service.getSingleTask(id);
  res.json(task);
};

const createTask = async (req, res) => {
  const payload = req.body;
  const newTask = await service.createTask(payload);
  res.json(newTask);
};

module.exports = {
  getAllTasks,
  getSingleTask,
  createTask,
};
