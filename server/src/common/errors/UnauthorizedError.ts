import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}
