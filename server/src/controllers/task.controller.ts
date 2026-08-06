import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { NotFoundError } from '../errors/custom.error';

export const createTask = async (req: Request, res: Response) => {
  // Fix TICKET-004: Removed artificial delay.
  // Add basic idempotency/duplication check
  const assigneeId = req.body.assignee || (req as any).user.id;
  
  const recentDuplicate = await Task.findOne({
    title: req.body.title,
    assignee: assigneeId,
    createdAt: { $gte: new Date(Date.now() - 5000) }
  });

  if (recentDuplicate) {
    return res.status(200).json({
      status: 'success',
      data: { task: recentDuplicate },
    });
  }

  const task = await Task.create({
    ...req.body,
    assignee: req.body.assignee || (req as any).user.id,
  });

  res.status(201).json({
    status: 'success',
    data: { task },
  });
};

export const getTasks = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, status, priority, sort } = req.query;

  const query: any = {};

  // Filtering
  if (status) query.status = status;
  if (priority) query.priority = priority;

  // Searching
  if (search) {
    query.$text = { $search: search as string };
  }

  // Sorting
  // Feature [JIRA-884]: Allow dynamic column sorting for the new Data Table.
  let sortStr = '-createdAt';
  if (sort) {
    // BUG-001 INJECTED: 
    // We are trusting the user's sort field entirely. If they sort by a non-unique field
    // like 'status' or 'priority', MongoDB does not guarantee a deterministic sort order.
    // This will cause data duplication and skipping across paginated requests.
    sortStr = (sort as string).split(',').join(' ') + ' _id';
  } else if (search) {
    // If searching, sort by relevance by default
    sortStr = ''; 
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const mQuery = Task.find(query);
  if (sortStr) {
    mQuery.sort(sortStr);
  }

  const tasks = await mQuery
    .skip(skip)
    .limit(limitNum)
    .populate('assignee', 'name email avatarUrl');

  const total = await Task.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
    data: { tasks },
  });
};

export const getTask = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id).populate('assignee', 'name email');

  if (!task) {
    throw new NotFoundError('No task found with that ID');
  }

  res.status(200).json({
    status: 'success',
    data: { task },
  });
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new NotFoundError('No task found with that ID');
  }

  res.status(200).json({
    status: 'success',
    data: { task },
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new NotFoundError('No task found with that ID');
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
