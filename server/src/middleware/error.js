import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

/**
 * Handles requests to routes that do not exist (404).
 */
const notFound = (req, res, next) => {
    next(new AppError(`The requested URL was not found on this server: ${req.originalUrl}`, 404));
};

/**
 * The main error handling middleware for the application.
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error
    logger.error(err.message, { stack: err.stack });

    // Send a simplified error message in production
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

    // Send a detailed error message in development
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

export { notFound, errorHandler };