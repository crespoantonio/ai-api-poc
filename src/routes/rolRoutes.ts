// src/routes/rolRoutes.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { createRole, getAllRoles, assignRole, removeRole } from '../controllers/roleController';

const router = express.Router();

router.post('/roles', authMiddleware, createRole);
router.get('/roles', authMiddleware, getAllRoles);
router.post('/users/:userId/roles/:roleId', authMiddleware, assignRole);
router.delete('/users/:userId/roles/:roleId', authMiddleware, removeRole);

export default router;