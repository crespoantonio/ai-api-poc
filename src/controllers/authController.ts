// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../database/db';
import { User } from '../models/user';
import { authQueries } from '../queries/authQueries';
import logger from '../logger';
import jwt from 'jsonwebtoken';
import { rolQueries } from '../queries/rolQueries';

// Regular expression for validating email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum password length
const minPasswordLength = 8;

export const registerUser = async (req: Request, res: Response) => {
    const { name, lastName, email, username, password } = req.body as User;

    // Validate email format
    if (!emailRegex.test(email)) {
        logger.error('Invalid email address:', email);
        return res.status(400).json({ message: 'Invalid email address' });
    }

    // Validate password length
    if (password.length < minPasswordLength) {
        logger.error('Password too short:', password);
        return res.status(400).json({ message: `Password must be at least ${minPasswordLength} characters long` });
    }

    const client = await pool.connect(); // Acquire a client from the pool

    try {
        await client.query('BEGIN'); // Begin transaction

        // Check if email or username already exists
        const existingUser = await client.query(authQueries.checkExistingUser, [email, username]);
        if (existingUser.rows.length > 0) {
            logger.error('Email or username already exists:', { email, username });
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const newUser = await client.query(authQueries.insertUser, [name,lastName, email, username, hashedPassword]);

        await client.query('COMMIT'); // Commit transaction
        logger.info('User registered successfully:', { email, username });
        res.status(201).json({ message: 'User registered successfully' });
        
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction in case of error
        logger.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await pool.query(authQueries.selectUserByUsername, [username]);
        if (user.rows.length === 0) {
            logger.error('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            logger.error('Invalid credentials');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Fetch user roles from the database
        const roles = await pool.query(rolQueries.selectUserRolesByUsername, [username]);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.rows[0].id, 
                username: user.rows[0].username,
                roles: roles.rows.map(role => role.name) // Add roles to the token
            }, 
            process.env.JWT_SECRET!, 
            { expiresIn: '1h' }
        );
        logger.info('token generated');

        // Send success response
        res.header('Authorization', token).json({ message: 'Login successful' });
        
    } catch (error) {
        logger.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};