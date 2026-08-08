const service = require("./tasks.service");

const getAllTasks = async (req, res) => {
  const query = req.query;
  const tasks = await service.getAllTasks(query);
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

const updateTask = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const updatedTask = await service.updateTask(id, payload);
  res.json(updatedTask);
};

const deleteTask = async (req, res) => {
  const id = req.params.id;
  const deletedTask = await service.deleteTask(id);
  res.json(deletedTask);
};

const getTaskStats = async (req, res) => {
  const stats = await service.getTaskStats();
  res.json(stats);
};

module.exports = {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
