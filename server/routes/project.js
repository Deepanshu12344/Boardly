import express from 'express';
import {
  addProject,
  getAllProjects,
  getProjectDetails,
  deleteProject,
  updateProject,
} from '../controllers/project.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', verifyToken, addProject);

router.get('/get', verifyToken, getAllProjects);

router.get('/project/:projectId', verifyToken, getProjectDetails);

router.delete('/:projectId', verifyToken, deleteProject);

router.put('/:projectId', verifyToken, updateProject);

export default router;
