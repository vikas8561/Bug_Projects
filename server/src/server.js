"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-tracker';
process.on('uncaughtException', (err) => {
    logger_1.logger.error('UNCAUGHT EXCEPTION! Shutting down...');
    logger_1.logger.error(err.name, err.message);
    process.exit(1);
});
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    logger_1.logger.info('Connected to MongoDB successfully');
    const server = app_1.default.listen(PORT, () => {
        logger_1.logger.info(`Server running on port ${PORT}`);
    });
    process.on('unhandledRejection', (err) => {
        logger_1.logger.error('UNHANDLED REJECTION! Shutting down...');
        logger_1.logger.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
})
    .catch((error) => {
    logger_1.logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map