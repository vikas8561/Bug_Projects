import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Task } from '../models/Task';

dotenv.config();

const backfillTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    const statuses = ['Todo', 'In Progress', 'In Review', 'Done'];
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    for (const user of users) {
      const taskCount = await Task.countDocuments({ assignee: user._id });
      console.log(`User ${user.email} has ${taskCount} tasks.`);

      if (taskCount < 200) {
        const tasksToCreate = 200 - taskCount;
        console.log(`Creating ${tasksToCreate} tasks for user ${user.email}...`);

        const seedTasks = [];
        for (let i = 1; i <= tasksToCreate; i++) {
          seedTasks.push({
            title: `Debug Ticket #${taskCount + i} - Platform Auto-Generated (Backfill)`,
            description: `This task was automatically generated so you can test dashboard functionality.`,
            status: statuses[i % 4],
            priority: priorities[i % 4],
            assignee: user._id,
            creator: user._id,
            createdAt: new Date(Date.now() - i * 3600000), // Staggered creation times
          });
        }
        await Task.insertMany(seedTasks);
        console.log(`Finished backfilling tasks for user ${user.email}.`);
      }
    }

    console.log('Backfill complete!');
  } catch (error) {
    console.error('Error backfilling tasks:', error);
  } finally {
    await mongoose.disconnect();
  }
};

backfillTasks();
