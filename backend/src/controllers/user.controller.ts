import { Request, Response, NextFunction } from "express";
import { getTokenFromRequest, getUserIdFromToken } from "../utils/helpers";
import { User } from "../models/user.model";
import { Task } from "../models/task.model";
import { UserDocument } from "../types/user.types";
import { Types } from "mongoose";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromRequest(req);
    const id = getUserIdFromToken(token);
    const user = await User.findById(id).populate("tasks");
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      res.status(200).json(user.tasks);
    }
  } catch (err) {
    next(err);
  }
};

export const upsertTask = async (
  req: Request<
    {},
    {},
    {
      id?: string;
      category: string;
      description: string;
      status: string;
      endDate: string;
    },
    {}
  >,
  res: Response
) => {
  const user: UserDocument | null = req.user;
  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    const { id, category, description, status, endDate } = req.body;
    let task;
    let statusCode = 200;
    let payload = {};
    try {
      if (!id) {
        // create
        task = await Task.create({
          category,
          description,
          status,
          endDate,
        });
        user.tasks.push(task);
        statusCode = 201;
        payload = { message: "Task Created" };
      } else if (id && !Types.ObjectId.isValid(id)) {
        // 404 invalid task id
        statusCode = 404;
        payload = { message: "Invalid Task ID" };
      } else {
        // update
        const updated = await Task.findByIdAndUpdate(id, {
          category,
          description,
          status,
          endDate,
        });
        if (updated) {
          statusCode = 200;
          payload = updated;
        } else {
          statusCode = 404;
          payload = { message: "Task Not Found" };
        }
      }
    } catch (error) {
      statusCode = 500;
      payload = {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      };
    }
    await user.save();
    await task?.save();
    res.status(statusCode).json(payload);
  }
};
