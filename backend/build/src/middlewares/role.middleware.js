"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowOnly = allowOnly;
// Usage: restrictTo("admin", "agent")
function allowOnly(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user; // Assumes req.user is populated by authentication middleware
        if (!user || !allowedRoles.includes(user.role)) {
            return res
                .status(403)
                .json({ message: "Access denied: insufficient permissions." });
        }
        next();
    };
}
