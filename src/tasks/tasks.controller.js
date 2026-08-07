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

module.exports = {
  getAllTasks,
  getSingleTask,
};
