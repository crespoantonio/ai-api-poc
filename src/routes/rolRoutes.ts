// src/routes/rolRoutes.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import rolMiddleware from '../middleware/rolMiddleware';
import { getAllRoles, assignRoleToUser, removeRoleToUser } from '../controllers/roleController';
import Roles from '../enums/roleEnums';

const router = express.Router();

router.get('/getAll', authMiddleware, getAllRoles);
router.post('/assignRole', authMiddleware, rolMiddleware([Roles.JDAdmin]), assignRoleToUser);
router.delete('/deleteRole', authMiddleware,rolMiddleware([Roles.JDAdmin]), removeRoleToUser);

export default router;