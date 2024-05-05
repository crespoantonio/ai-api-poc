// controllers/roleController.ts
import { Request, Response } from 'express';
import pool from '../database/db';
import { Rol } from '../models/rol';
import logger from '../logger';
import { queries } from '../queries/rolQueries';


export const createRole = async (req: Request, res: Response) => {
    try {
      const { name, description }: Rol = req.body;
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        await client.query(queries.insertRole, [name, description]);
        
        await client.query('COMMIT');
        logger.info('Role created successfully');
        res.status(200).json({ message: 'Role created successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error' });
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error creating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllRoles = async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        const roles = await client.query(queries.selectRoles);
  
        await client.query('COMMIT');
        logger.info('Roles fetched successfully');
        res.json(roles.rows);
      } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error' });
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error fetching roles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const assignRole = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const roleId = req.params.roleId;
      
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        // Example implementation: 
        // 1. Check if the user and role exist
        const userExists = await client.query(queries.checkUserExists, [userId]);
        const roleExists = await client.query(queries.checkRoleExists, [roleId]);
    
        if (userExists.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (roleExists.rows.length === 0) {
          return res.status(404).json({ message: 'Role not found' });
        }
    
        // 2. If they exist, insert a record into the user_roles table linking the user and the role
        await client.query(queries.insertUserRoles, [userId, roleId]);
  
        await client.query('COMMIT');
        logger.info(`Role ${roleId} assigned to user ${userId} successfully`);
        res.status(200).json({ message: 'Role assigned successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error assigning role:', error);
        res.status(500).json({ message: 'Internal server error' });
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error assigning role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const removeRole = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const roleId = req.params.roleId;
      
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        // Example implementation: 
        // 1. Check if the user and role exist
        const userExists = await client.query(queries.checkUserExists, [userId]);
        const roleExists = await client.query(queries.checkRoleExists, [roleId]);
    
        if (userExists.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (roleExists.rows.length === 0) {
          return res.status(404).json({ message: 'Role not found' });
        }
    
        // 2. If they exist, delete the corresponding record from the user_roles table
        await client.query(queries.removeUserRoles, [userId, roleId]);
  
        await client.query('COMMIT');
        logger.info(`Role ${roleId} removed from user ${userId} successfully`);
        res.status(200).json({ message: 'Role removed successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Error removing role:', error);
        res.status(500).json({ message: 'Internal server error' });
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error removing role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
