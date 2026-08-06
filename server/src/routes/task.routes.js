"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protect all routes after this middleware
router.use(auth_middleware_1.protect);
router.route('/').get(task_controller_1.getTasks).post(task_controller_1.createTask);
router
    .route('/:id')
    .get(task_controller_1.getTask)
    .put(task_controller_1.updateTask)
    .delete((0, auth_middleware_1.restrictTo)('Admin', 'Manager'), task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map