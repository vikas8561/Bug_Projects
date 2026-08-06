import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/').get(getTasks).post(createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(restrictTo('Admin', 'Manager'), deleteTask);

export default router;
