import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Operational App Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = (err as unknown as { issues?: Array<{ path: (string | number)[]; message: string }> }).issues || [];
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: issues.map((e) => ({
          field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Generic or unexpected runtime errors
  const isDev = process.env.NODE_ENV === "development";
  console.error("Unhandled Error:", err);

  const errorObj = err instanceof Error ? err : new Error(String(err));
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isDev ? errorObj.message : "An unexpected internal server error occurred",
      ...(isDev ? { stack: errorObj.stack } : {}),
    },
  });
};
