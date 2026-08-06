"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.globalErrorHandler = void 0;
const express_1 = require("express");
const custom_error_1 = require("../errors/custom.error");
const logger_1 = require("../utils/logger");
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.error(`[${req.method}] ${req.originalUrl} >> StatusCode:: ${err.statusCode}, Message:: ${err.message}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }
    else {
        // Production Mode: don't leak error details
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        else {
            // Log programming or other unknown error
            logger_1.logger.error('ERROR 💥:', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundHandler = (req, res, next) => {
    next(new custom_error_1.NotFoundError(`Can't find ${req.originalUrl} on this server!`));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map