import type { Request, Response, NextFunction } from "express";
import { type ZodType, ZodError } from "zod";

export interface RequestValidationSchemas {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: ZodType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: ZodType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: ZodType<any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = (schema: ZodType<any> | RequestValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if ("parseAsync" in schema && typeof schema.parseAsync === "function") {
        // Direct body schema
        req.body = await schema.parseAsync(req.body);
      } else {
        // Multi-part schema (body, query, params)
        const multiSchema = schema as RequestValidationSchemas;
        if (multiSchema.body) {
          req.body = await multiSchema.body.parseAsync(req.body);
        }
        if (multiSchema.query) {
          req.query = await multiSchema.query.parseAsync(req.query);
        }
        if (multiSchema.params) {
          req.params = await multiSchema.params.parseAsync(req.params);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as unknown as { issues?: Array<{ path: (string | number)[]; message: string }> }).issues || [];
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request payload",
            details: issues.map((e) => ({
              field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
              message: e.message,
            })),
          },
        });
        return;
      }
      next(error);
    }
  };
};
