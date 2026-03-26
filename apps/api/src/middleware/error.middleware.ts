import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { createLogger } from "@dataflow/logger";

const logger = createLogger("error-handler");

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    logger.warn(
      { statusCode: err.statusCode, path: req.path, method: req.method },
      err.message,
    );
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  logger.error(
    { err, path: req.path, method: req.method },
    "Unhandled error",
  );

  return res.status(500).json({
    error: "Internal Server Error.",
  });
}
