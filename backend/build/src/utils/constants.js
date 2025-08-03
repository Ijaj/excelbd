"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoDaysInMilliseconds = exports.paymentMethods = exports.priorityConfig = exports.statusConfig = void 0;
exports.defaultEstimatedDate = defaultEstimatedDate;
exports.statusConfig = {
    pending: "Pending Pickup",
    "picked-up": "Picked up",
    "in-transit": "In Transit",
    delivered: "Delivered",
    failed: "Failed",
    cancelled: "Cancelled",
};
exports.priorityConfig = {
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
};
exports.paymentMethods = {
    cod: "Cash On Delivery",
    "pre-paid": "Pre-Paid",
};
exports.twoDaysInMilliseconds = 172800000; // 2 days in milliseconds
function defaultEstimatedDate() {
    return new Date(new Date().getTime() + exports.twoDaysInMilliseconds);
}
