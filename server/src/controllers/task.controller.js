"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTask = exports.getTasks = exports.createTask = void 0;
const express_1 = require("express");
const Task_1 = require("../models/Task");
const custom_error_1 = require("../errors/custom.error");
const createTask = async (req, res) => {
    const task = await Task_1.Task.create({
        ...req.body,
        assignee: req.body.assignee || req.user.id,
    });
    res.status(201).json({
        status: 'success',
        data: { task },
    });
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    const { page = 1, limit = 10, search, status, priority, sort } = req.query;
    const query = {};
    // Filtering
    if (status)
        query.status = status;
    if (priority)
        query.priority = priority;
    // Searching
    if (search) {
        query.$text = { $search: search };
    }
    // Sorting
    let sortStr = '-createdAt';
    if (sort) {
        sortStr = sort.split(',').join(' ');
    }
    else if (search) {
        // If searching, sort by relevance by default
        sortStr = '';
    }
    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const mQuery = Task_1.Task.find(query);
    if (sortStr) {
        mQuery.sort(sortStr);
    }
    const tasks = await mQuery
        .skip(skip)
        .limit(limitNum)
        .populate('assignee', 'name email avatarUrl');
    const total = await Task_1.Task.countDocuments(query);
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
exports.getTasks = getTasks;
const getTask = async (req, res) => {
    const task = await Task_1.Task.findById(req.params.id).populate('assignee', 'name email');
    if (!task) {
        throw new custom_error_1.NotFoundError('No task found with that ID');
    }
    res.status(200).json({
        status: 'success',
        data: { task },
    });
};
exports.getTask = getTask;
const updateTask = async (req, res) => {
    const task = await Task_1.Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!task) {
        throw new custom_error_1.NotFoundError('No task found with that ID');
    }
    res.status(200).json({
        status: 'success',
        data: { task },
    });
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const task = await Task_1.Task.findByIdAndDelete(req.params.id);
    if (!task) {
        throw new custom_error_1.NotFoundError('No task found with that ID');
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.controller.js.map