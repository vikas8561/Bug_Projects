"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const custom_error_1 = require("../errors/custom.error");
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        throw new custom_error_1.ValidationError('Email already in use');
    }
    const user = await User_1.User.create({
        name,
        email,
        password,
    });
    const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
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
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new custom_error_1.ValidationError('Please provide email and password');
    }
    const user = await User_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new custom_error_1.UnauthorizedError('Incorrect email or password');
    }
    if (!user.isActive) {
        throw new custom_error_1.UnauthorizedError('Your account has been deactivated.');
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
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
exports.login = login;
const logout = (req, res) => {
    res.cookie('refreshToken', 'loggedout', {
        ...cookieOptions,
        maxAge: 10 * 1000, // expire in 10 seconds
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map