"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    console.error(err.errors ? err.errors : "No additional errors");
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        errors: err.errors || [],
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: "Not Found" });
};
exports.notFoundHandler = notFoundHandler;
