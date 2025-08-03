import { Request, Response } from "express";
import { UserDocument } from "../types/user.types";
import { socketService } from "../services/socket.service";
import { ApiError } from "../utils/ApiError";
import {
  createParcel,
  getAllParcels as getAllParcelsService,
  getParcelsByAgent as getParcelsByAgentService,
  getParcelsByUser as getParcelsByUserService,
  getParcelByTrackingNumber as getParcelByTrackingNumberService,
  updateParcelByTrackingNumber,
  deleteManyParcelsByTrackingNumber,
} from "../services/parcel.service";
import { defaultEstimatedDate } from "../utils/constants";
import { getUserById, getUserRoleById } from "../services/user.service";
import { sendParcelNotification } from "../services/email.service";

function emitAllParcelsUpdate() {
  getAllParcelsService()
    .then((parcels) => {
      socketService.emitEvent("allParcels", parcels);
    })
    .catch((err) => {
      console.error("Failed to emit all parcels update:", err);
    });
}

// Add new parcel
export const addParcel = async (req: Request, res: Response) => {
  const parcelData = req.body;
  const user: UserDocument = req.user as UserDocument;
  if (user && user.role === "customer") {
    const company = parcelData.sender?.company || null;
    parcelData.sender = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      company: company,
    };
  }

  parcelData.timeline = [
    {
      status: "created",
      timestamp: Date.now(),
      updatedBy: user ? (user._id as string).toString() : "system",
    },
    {
      status: "pending",
      timestamp: Date.now(),
      updatedBy: user ? (user._id as string).toString() : "system",
    },
  ];

  try {
    const newParcel = await createParcel(parcelData);
    // add the new parcel to the user's parcels array
    if (user && user.role === "customer") {
      user.parcels.push((newParcel._id as string).toString());
      await user.save();
    }
    emitAllParcelsUpdate();
    res.status(201).json(newParcel);
  } catch (err) {
    res.status(500).json({ message: "Failed to create parcel", error: err });
  }
};

// Get all parcels
export const getAllParcels = async (req: Request, res: Response) => {
  const user: UserDocument = req.user as UserDocument;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    if (user.role === "admin") {
      const parcels = await getAllParcelsService();
      res.json(parcels);
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
};

// Get all parcels assigned to an agent
export const getParcelsByAgent = async (req: Request, res: Response) => {
  const user: UserDocument = req.user as UserDocument;
  if (!user || user.role === "customer") {
    throw new ApiError(403, "Access denied");
  }
  const agentId = req.params.agentId as string;
  if (!agentId) {
    throw new ApiError(400, "Agent ID is required");
  }
  try {
    const parcels = await getParcelsByAgentService(agentId);
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agent's parcels" });
  }
};

// Get all parcels for a specific user (by email)
export const getParcelsByUser: (req: Request, res: Response) => Promise<void> =
  async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;
    if (
      user &&
      (user.role === "admin" ||
        (user.role === "customer" && user.email === req.params.email))
    ) {
      const { email } = req.params;
      try {
        // const parcels = await getParcelsByUserService(email);
        await user.populate("parcels");
        console.log("User's parcels:", user.parcels);
        res.status(200).json(user.parcels);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch user's parcels" });
      }
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  };

// Get all info of a specific parcel (by trackingNumber)
export const getParcelByTrackingNumber = async (
  req: Request,
  res: Response
) => {
  const { trackingNumber } = req.params;
  try {
    const parcel = await getParcelByTrackingNumberService(trackingNumber);
    if (!parcel) return res.status(404).json({ error: "Parcel not found" });
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcel" });
  }
};

// Update parcel info (status, assignedAgent, pickup, estimated, priority)
export const updateParcel = async (req: Request, res: Response) => {
  const user: UserDocument = req.user as UserDocument;
  const { trackingNumber } = req.params;
  const { status, assignedAgent, estimated, priority, note } = req.body;

  const parcel = await getParcelByTrackingNumberService(trackingNumber);
  if (!parcel) {
    throw new ApiError(404, "Parcel not found", [
      { field: "param.trackingNumber", message: "Invalid Parcel ID" },
    ]);
  }

  /** 🔹 1. Set lastUpdatedBy and lastStatusNote if user exists */
  const update: any = {
    lastUpdatedBy: user ? (user._id as string).toString() : "guest",
  };
  if (note) update.lastStatusNote = note;

  /** 🔹 2. Agent can be assigned while status is 'pending'.
   * Status cannot change to anything except 'cancelled' without an agent */
  if (
    status &&
    status !== "pending" &&
    status !== "cancelled" &&
    !assignedAgent &&
    !parcel.assignedAgent
  ) {
    throw new ApiError(
      400,
      "Cannot change status unless an agent is assigned (except cancelling)."
    );
  }

  /** 🔹 3. Prevent un-assigning agent if status = 'in-transit' */
  if (
    parcel.assignedAgent &&
    !assignedAgent &&
    parcel.status === "in-transit"
  ) {
    throw new ApiError(
      400,
      "Cannot un-assign agent while the parcel is in-transit."
    );
  }

  /** 🔹 4. Validate assignedAgent role and max capacity */
  let newAgent: UserDocument | null | undefined = null;
  if (assignedAgent) {
    if (user.role !== "admin") {
      throw new ApiError(403, "Only admins can assign agents.");
    }

    const role = await getUserRoleById(assignedAgent);
    if (role !== "agent") {
      throw new ApiError(400, "Assigned agent must be a valid agent");
    }

    newAgent = await getUserById(assignedAgent);
    if (!newAgent) throw new ApiError(404, "Agent not found");

    if (newAgent.currentParcels >= newAgent.maxCapacity) {
      throw new ApiError(
        400,
        "This agent has reached their maximum parcel capacity."
      );
    }

    update.assignedAgent = assignedAgent;
  }

  /** 🔹 5. Handle status updates */
  if (status) {
    update.status = status;

    // If picked-up, set pickup date and estimated date if not provided
    if (status === "picked-up") {
      update["dates.pickup"] = new Date();
      update["dates.estimated"] = estimated ?? defaultEstimatedDate();
    }

    // If failed or delivered, decrement agent's currentParcels
    if (
      (status === "failed" ||
        status === "delivered" ||
        status === "cancelled") &&
      parcel.assignedAgent
    ) {
      const agent = await getUserById(parcel.assignedAgent);
      if (agent && agent.currentParcels > 0) {
        agent.currentParcels -= 1;
        await agent.save();
      }
    }
  }

  /** 🔹 6. Update priority if provided */
  if (priority) update.priority = priority;

  /** 🔹 7. Update estimated date manually if provided */
  if (estimated && status !== "picked-up") {
    update["dates.estimated"] = estimated;
  }

  /** 🔹 Perform the update */
  try {
    const updatedParcel = await updateParcelByTrackingNumber(
      trackingNumber,
      update
    );

    if (!updatedParcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    // Send email notification when status changes
    if (status) {
      try {
        await sendParcelNotification(updatedParcel);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't throw error, continue with the response
      }
    }

    /** 🔹 8. If agent is newly assigned and status = picked-up, add parcel to agent's array */
    if (newAgent && status === "picked-up") {
      if (
        !newAgent.parcels.includes((updatedParcel._id as string).toString())
      ) {
        newAgent.parcels.push((updatedParcel._id as string).toString());
        newAgent.currentParcels += 1;
        await newAgent.save();
      }
    }

    emitAllParcelsUpdate();
    res.json(updatedParcel);
  } catch (err) {
    res.status(500).json({ error: "Failed to update parcel" });
  }
};

export const deleteParcel = async (req: Request, res: Response) => {
  const user: UserDocument = req.user as UserDocument;
  const trk: string[] = req.body;

  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  if (!trk || (Array.isArray(trk) && trk.length === 0)) {
    res.status(400).json({ error: "Tracking number is required" });
    return;
  }
  try {
    const deletedParcel = await deleteManyParcelsByTrackingNumber(
      trk as string[]
    );
    if (!deletedParcel) {
      res.status(404).json({ error: "Parcel not found" });
    }
    emitAllParcelsUpdate();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete parcel" });
  }
};
