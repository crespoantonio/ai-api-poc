// middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    console.log('Received token:', token);
  
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      console.log('Decoded token:', decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error decoding token:', error);
      res.status(400).json({ message: 'Invalid token.' });
    }
};
