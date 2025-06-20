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

router.post('/', verifyToken, createTask);

router.get('/', verifyToken, getAllTasks);

router.get('/:taskId', verifyToken, getTaskById);

router.put('/:taskId', verifyToken, updateTask);

router.delete('/:taskId', verifyToken, deleteTask);

router.patch('/:taskId/status', verifyToken, updateTaskStatus);

export default router;
