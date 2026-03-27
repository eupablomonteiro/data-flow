import { Request, Response, NextFunction } from "express";
import { SecurityUtils } from "../common/utils/security";

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user: {
        sub: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["auth_token"];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token is missing.",
    });
  }

  try {
    const decoded = SecurityUtils.verifyToken(token) as {
      sub: string;
      email: string;
    };

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid authentication token.",
    });
  }
};
