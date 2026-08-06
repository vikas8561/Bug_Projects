import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { UnauthorizedError, ValidationError } from '../errors/custom.error';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

import { Task } from '../models/Task';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email already in use');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  // --- CURRICULUM SEEDER ---
  // Automatically seed 25 tasks assigned to the new student so they can immediately
  // test bugs like the Non-Deterministic Pagination (BUG-001) without manual data entry.
  const seedTasks = [];
  const statuses = ['Todo', 'In Progress', 'In Review', 'Done'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  
  for (let i = 1; i <= 25; i++) {
    seedTasks.push({
      title: `Debug Ticket #${i} - Platform Auto-Generated`,
      description: `This task was automatically generated so you can test dashboard functionality. Note: A bug has been reported that tasks duplicate when paginating by status.`,
      status: statuses[i % 4],
      priority: priorities[i % 4],
      assignee: user._id,
      creator: user._id,
      createdAt: new Date(Date.now() - i * 3600000), // Staggered creation times
    });
  }
  await Task.insertMany(seedTasks);
  // -------------------------

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated.');
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
    },
  });
};

export const logout = (req: Request, res: Response) => {
  res.cookie('refreshToken', 'loggedout', {
    ...cookieOptions,
    maxAge: 10 * 1000, // expire in 10 seconds
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
