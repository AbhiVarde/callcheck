import { ZodSchema } from "zod";
import { validateToolCall, ValidationResult } from "./core.js";
import { Logger, buildLoggedRun } from "./logger.js";

export type RepairAttempt = {
  attempt: number;
  errors: string[];
  output: unknown;
};

export type RepairResult<T> =
  | { success: true; data: T; attempts: RepairAttempt[] }
  | { success: false; attempts: RepairAttempt[] };

export type RetryFn = (prompt: string) => Promise<unknown>;

export function buildRepairPrompt(errors: string[], response: unknown): string {
  const errorList = errors.map((e) => `- ${e}`).join("\n");
  return [
    "The following JSON failed schema validation.",
    "",
    "Response:",
    JSON.stringify(response, null, 2),
    "",
    "Errors:",
    errorList,
    "",
    "Return corrected JSON only. No explanation, no markdown, no code fences.",
  ].join("\n");
}

function parseModelOutput(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  const trimmed = raw
    .trim()
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

export type RepairOptions = {
  maxAttempts?: number;
  logger?: Logger;
  schemaName?: string;
  model?: string;
};

export async function repairToolCall<T>(
  schema: ZodSchema<T>,
  response: unknown,
  retry: RetryFn,
  options: RepairOptions = {},
): Promise<RepairResult<T>> {
  const maxAttempts = options.maxAttempts ?? 3;
  const attempts: RepairAttempt[] = [];
  let current = response;

  for (let i = 1; i <= maxAttempts; i++) {
    const result: ValidationResult<T> = validateToolCall(schema, current);

    if (result.success) {
      if (options.logger) {
        const run = buildLoggedRun(
          options.schemaName ?? "unnamed",
          options.model ?? "unknown",
          attempts,
          true,
        );
        await options.logger.log(run);
      }
      return { success: true, data: result.data, attempts };
    }

    attempts.push({ attempt: i, errors: result.errors, output: current });

    if (i === maxAttempts) {
      if (options.logger) {
        const run = buildLoggedRun(
          options.schemaName ?? "unnamed",
          options.model ?? "unknown",
          attempts,
          false,
        );
        await options.logger.log(run);
      }
      return { success: false, attempts };
    }

    const prompt = buildRepairPrompt(result.errors, current);
    const raw = await retry(prompt);
    current = parseModelOutput(raw);
  }

  return { success: false, attempts };
}
