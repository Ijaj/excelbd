import { Request, Response } from "express";
import { UserDocument } from "../types/user.types";
import { socketService } from "../services/socket.service";
import {
  getAllAgentsService,
  getAllAvailableAgentsService,
  getAllCustomersService,
  getUserById,
} from "../services/user.service";
import { User } from "../models/user.model";

export const getAllUsers = async (req: Request, res: Response) => {
  const user: UserDocument = req.user as UserDocument;
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await getAllAgentsService();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
};

export const getAllAvailableAgents = async (req: Request, res: Response) => {
  try {
    const availableAgents = await getAllAvailableAgentsService();
    res.json(availableAgents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch available agents" });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomersService();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getAgentById = async (req: Request, res: Response) => {
  // get agent by id
  const user: UserDocument = req.user as UserDocument;
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
    const agent = await getAllAgentsService(agentId);
    if (!agent) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agent" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  // get customer by id
  const user: UserDocument = req.user as UserDocument;
  if (
    !user ||
    user.role === "agent" ||
    (user.role === "customer" &&
      req.params.id !== (user._id as string).toString())
  ) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const customerId = req.params.id;
  if (!customerId) {
    res.status(400).json({ error: "Customer ID is required" });
    return;
  }

  try {
    const customer = await getUserById(customerId);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

export const getParcelsByCustomerId = async (req: Request, res: Response) => {
  // get parcels by customer id
  const user: UserDocument = req.user as UserDocument;
  if (
    !user ||
    user.role === "agent" ||
    (user.role === "customer" &&
      req.params.id !== (user._id as string).toString())
  ) {
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
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
};
