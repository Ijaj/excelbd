"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendParcelNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendParcelNotification = async (parcel) => {
    const emailContent = `
    <h2>Parcel Tracking Information</h2>
    <p><strong>Tracking Number:</strong> ${parcel.trackingNumber}</p>
    <p><strong>Status:</strong> ${parcel.status}</p>
    <p><strong>Priority:</strong> ${parcel.priority}</p>
    <p><strong>Estimated Delivery:</strong> ${parcel.dates?.estimated ? parcel.dates.estimated : "Not set"}</p>
    
    <h3>Sender Information:</h3>
    <p>Name: ${parcel.sender.name}</p>
    <p>Email: ${parcel.sender.email}</p>
    <p>Phone: ${parcel.sender.phone}</p>
    
    <h3>Recipient Information:</h3>
    <p>Name: ${parcel.recipient.name}</p>
    <p>Email: ${parcel.recipient.email}</p>
    <p>Phone: ${parcel.recipient.phone}</p>
    <p>Address: ${parcel.recipient.address}</p>
    
    <p>Track your parcel at: <a href="${process.env.FRONTEND_URL}/track/${parcel.trackingNumber}">Track Parcel</a></p>
  `;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${parcel.sender.email}, ${parcel.recipient.email}`,
        subject: `Parcel Update - ${parcel.trackingNumber}`,
        html: emailContent,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
exports.sendParcelNotification = sendParcelNotification;
