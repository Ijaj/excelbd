"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParcelsByCustomerId = exports.getCustomerById = exports.getAgentById = exports.getAllCustomers = exports.getAllAvailableAgents = exports.getAllAgents = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const user_model_1 = require("../models/user.model");
const getAllUsers = async (req, res) => {
    const user = req.user;
    if (!user || user.role !== "admin") {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    try {
        const users = await user_model_1.User.find().select("-password");
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
const getAllAgents = async (req, res) => {
    try {
        const agents = await (0, user_service_1.getAllAgentsService)();
        res.json(agents);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch agents" });
    }
};
exports.getAllAgents = getAllAgents;
const getAllAvailableAgents = async (req, res) => {
    try {
        const availableAgents = await (0, user_service_1.getAllAvailableAgentsService)();
        res.json(availableAgents);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch available agents" });
    }
};
exports.getAllAvailableAgents = getAllAvailableAgents;
const getAllCustomers = async (req, res) => {
    try {
        const customers = await (0, user_service_1.getAllCustomersService)();
        res.json(customers);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.getAllCustomers = getAllCustomers;
const getAgentById = async (req, res) => {
    // get agent by id
    const user = req.user;
    if (!user || user.role !== "admin") {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    const agentId = req.params.id;
    if (!agentId) {
        res.status(400).json({ error: "Agent ID is required" });
        return;
    }
    try {
        const agent = await (0, user_service_1.getAllAgentsService)(agentId);
        if (!agent) {
            res.status(404).json({ error: "Agent not found" });
            return;
        }
        res.json(agent);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch agent" });
    }
};
exports.getAgentById = getAgentById;
const getCustomerById = async (req, res) => {
    // get customer by id
    const user = req.user;
    if (!user ||
        user.role === "agent" ||
        (user.role === "customer" &&
            req.params.id !== user._id.toString())) {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    const customerId = req.params.id;
    if (!customerId) {
        res.status(400).json({ error: "Customer ID is required" });
        return;
    }
    try {
        const customer = await (0, user_service_1.getUserById)(customerId);
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        res.json(customer);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch customer" });
    }
};
exports.getCustomerById = getCustomerById;
const getParcelsByCustomerId = async (req, res) => {
    // get parcels by customer id
    const user = req.user;
    if (!user ||
        user.role === "agent" ||
        (user.role === "customer" &&
            req.params.id !== user._id.toString())) {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    const customerId = req.params.id;
    if (!customerId) {
        res.status(400).json({ error: "Customer ID is required" });
        return;
    }
    try {
        // const parcels = await socketService.getParcelsByCustomerId(customerId);
        // res.json(parcels);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch parcels" });
    }
};
exports.getParcelsByCustomerId = getParcelsByCustomerId;
