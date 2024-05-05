// controllers/roleController.ts
import { Request, Response } from 'express';
import pool from '../database/db';
import logger from '../logger';
import { rolQueries } from '../queries/rolQueries';

// Reusable function to handle transactions
const runTransaction = async (callback: Function) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await callback(client);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getAllRoles = async (req: Request, res: Response) => {
    try {
        await runTransaction(async (client: any) => {
            const roles = await client.query(rolQueries.selectRoles);
            logger.info('Roles fetched successfully');
            res.status(200).json(roles.rows);
        });
    } catch (error) {
        logger.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const assignRoleToUser = async (req: Request, res: Response) => {
    try {
        const roleAssignments = req.body;

        if (!Array.isArray(roleAssignments) || roleAssignments.length === 0) {
            return res.status(400).json({ message: 'Invalid role assignments format' });
        }

        for (const assignment of roleAssignments) {
            if (!assignment.personId || !assignment.roleId) {
                return res.status(400).json({ message: 'Each role assignment must contain personId and roleId' });
            }
        }

        await runTransaction(async (client: any) => {
            let rolesAdded = 0;
            for (const assignment of roleAssignments) {
                const personId = assignment.personId;
                const roleId = assignment.roleId;

                const userExists = await client.query(rolQueries.checkUserExists, [personId]);
                if (userExists.rows.length === 0) {
                    return res.status(404).json({ message: `User with ID ${personId} not found` });
                }

                const userHasRole = await client.query(rolQueries.checkUserHasRole, [personId, roleId]);
                if (userHasRole.rows.length > 0) {
                    logger.warn(`User ${personId} already has role ${roleId} assigned`);
                    continue;
                }

                await client.query(rolQueries.insertUserRoles, [personId, roleId]);
                rolesAdded++;
                logger.info(`Role ${roleId} assigned to user ${personId} successfully`);
            }

            if (rolesAdded === 0) {
                return res.status(400).json({ message: 'No roles were added, user already has all assigned roles' });
            }

            res.status(201).json({ message: 'Roles assigned successfully' });
        });
    } catch (error) {
        logger.error('Error assigning roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeRoleToUser = async (req: Request, res: Response) => {
    try {
        const roleRemovals = req.body;

        if (!Array.isArray(roleRemovals) || roleRemovals.length === 0) {
            return res.status(400).json({ message: 'Invalid role removals format' });
        }

        for (const removal of roleRemovals) {
            if (!removal.personId || !removal.roleId) {
                return res.status(400).json({ message: 'Each role removal must contain personId and roleId' });
            }
        }

        await runTransaction(async (client: any) => {
            for (const removal of roleRemovals) {
                const personId = removal.personId;
                const roleId = removal.roleId;

                const userExists = await client.query(rolQueries.checkUserExists, [personId]);
                const roleExists = await client.query(rolQueries.checkRoleExists, [roleId]);

                if (userExists.rows.length === 0) {
                    return res.status(404).json({ message: `User with ID ${personId} not found` });
                }

                if (roleExists.rows.length === 0) {
                    return res.status(404).json({ message: `Role with ID ${roleId} not found` });
                }

                await client.query(rolQueries.removeUserRoles, [personId, roleId]);
                logger.info(`Role ${roleId} removed from user ${personId} successfully`);
            }

            res.status(200).json({ message: 'Roles removed successfully' });
        });
    } catch (error) {
        logger.error('Error removing roles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};