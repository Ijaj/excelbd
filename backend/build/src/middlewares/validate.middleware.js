"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
const validateMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const extracted = errors
            .array()
            .reduce((acc, err) => {
            if (err.type === "field") {
                const fieldError = err;
                acc.push({
                    field: fieldError.path,
                    message: fieldError.msg,
                });
            }
            return acc;
        }, []);
        return next(new ApiError_1.ApiError(400, "Validation Error", extracted));
    }
    next();
};
exports.validateMiddleware = validateMiddleware;
