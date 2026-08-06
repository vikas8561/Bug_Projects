import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../errors/custom.error';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('You are not logged in! Please log in to get access.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as any;
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new UnauthorizedError('The user belonging to this token does no longer exist.');
    }

    if (!currentUser.isActive) {
      throw new UnauthorizedError('Your account has been deactivated.');
    }

    // Grant access to protected route
    (req as any).user = currentUser;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token or token has expired.');
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
    next();
  };
};
