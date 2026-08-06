import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'Todo' | 'In Progress' | 'In Review' | 'Done';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    assignee?: mongoose.Types.ObjectId;
    project?: mongoose.Types.ObjectId;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Task: mongoose.Model<ITask, {}, {}, {}, Document<unknown, {}, ITask, {}, mongoose.DefaultSchemaOptions> & ITask & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITask>;
//# sourceMappingURL=Task.d.ts.map