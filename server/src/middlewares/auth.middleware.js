"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const custom_error_1 = require("../errors/custom.error");
const User_1 = require("../models/User");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        throw new custom_error_1.UnauthorizedError('You are not logged in! Please log in to get access.');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        const currentUser = await User_1.User.findById(decoded.id);
        if (!currentUser) {
            throw new custom_error_1.UnauthorizedError('The user belonging to this token does no longer exist.');
        }
        if (!currentUser.isActive) {
            throw new custom_error_1.UnauthorizedError('Your account has been deactivated.');
        }
        // Grant access to protected route
        req.user = currentUser;
        next();
    }
    catch (error) {
        throw new custom_error_1.UnauthorizedError('Invalid token or token has expired.');
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new custom_error_1.ForbiddenError('You do not have permission to perform this action');
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.middleware.js.map