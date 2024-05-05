// src/routes/rolRoutes.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getAllRoles, assignRoleToUser, removeRoleToUser } from '../controllers/roleController';

const router = express.Router();

router.get('/getAll', authMiddleware, getAllRoles);
router.post('/assignRole', authMiddleware, assignRoleToUser);
router.delete('/deleteRole', authMiddleware, removeRoleToUser);

export default router;