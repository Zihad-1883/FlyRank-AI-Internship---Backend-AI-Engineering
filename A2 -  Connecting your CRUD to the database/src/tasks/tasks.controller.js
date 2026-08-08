import * as service from './tasks.service.js';

export const getAllTasks = async (req, res) => {
  const query = req.query;
  const result = await service.getAllTasks(query);
  res.status(result.statusCode).json(result);
};

export const getSingleTask = async (req, res) => {
  const id = req.params.id;
  const result = await service.getSingleTask(id);
  res.status(result.statusCode).json(result);
};

export const createTask = async (req, res) => {
  const payload = req.body;
  const result = await service.createTask(payload);
  res.status(result.statusCode).json(result);
};

export const updateTask = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await service.updateTask(id, payload);
  res.status(result.statusCode).json(result);
};

export const deleteTask = async (req, res) => {
  const id = req.params.id;
  const result = await service.deleteTask(id);
  res.status(result.statusCode).json(result);
};

export const getTaskStats = async (req, res) => {
  const result = await service.getTaskStats();
  res.status(result.statusCode).json(result);
};
