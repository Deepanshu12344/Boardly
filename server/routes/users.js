import express from 'express';
import { getAllUsers, getMyProfile } from '../controllers/users.js';

const router = express.Router();

router.get('/profile/:id', getMyProfile);
router.get('/users', getAllUsers);


export default router;