import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    req.user = session.user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Authentication Error", error });
  }
};
