export const statusConfig = {
  pending: "Pending Pickup",
  "picked-up": "Picked up",
  "in-transit": "In Transit",
  delivered: "Delivered",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const priorityConfig = {
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const paymentMethods = {
  cod: "Cash On Delivery",
  "pre-paid": "Pre-Paid",
};

export const twoDaysInMilliseconds = 172800000; // 2 days in milliseconds

export function defaultEstimatedDate() {
  return new Date(new Date().getTime() + twoDaysInMilliseconds);
}
