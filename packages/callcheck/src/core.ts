import { z, ZodSchema } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export function validateToolCall<T>(
  schema: ZodSchema<T>,
  response: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(response);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join(".") || "(root)";
    return `${path}: ${issue.message}`;
  });

  return { success: false, errors };
}

export { z };
