import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
} from '../controllers/task.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', verifyToken, createTask);

router.get('/tasks', verifyToken, getAllTasks);

router.get('/task/:taskId', verifyToken, getTaskById);

router.put('/task/:taskId', verifyToken, updateTask);

router.delete('/task/:taskId', verifyToken, deleteTask);

router.patch('/task/:taskId/status', verifyToken, updateTaskStatus);

export default router;
