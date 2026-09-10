import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden - Insufficient permissions", details?: unknown) {
    super(message, 403, "FORBIDDEN", details);
  }
}
