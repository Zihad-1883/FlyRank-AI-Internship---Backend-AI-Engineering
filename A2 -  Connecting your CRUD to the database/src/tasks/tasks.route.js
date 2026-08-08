import express from 'express';
import {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from './tasks.controller.js';

export const router = express.Router();
export const statsRouter = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getSingleTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

statsRouter.get('/', getTaskStats);
