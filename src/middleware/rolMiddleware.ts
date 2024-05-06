// middleware/rolMiddleware.ts

import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export default (requiredRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const roles = req.user?.roles;
        if (!roles || !requiredRoles.some(role => roles.includes(role))) {
            return res.status(403).json({ message: 'Insufficient permissions.'});
        }
        next();
    };
};
