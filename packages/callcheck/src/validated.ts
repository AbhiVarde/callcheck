import { ZodSchema } from "zod";
import { repairToolCall, RetryFn } from "./repair.js";
import { Logger } from "./logger.js";

type ToolLike<T> = {
  description?: string;
  parameters: ZodSchema<T>;
  execute: (input: T) => Promise<unknown>;
};

export function validated<T>(
  toolDef: ToolLike<T>,
  options: {
    repair?: boolean;
    retry?: RetryFn;
    maxAttempts?: number;
    logger?: Logger;
    schemaName?: string;
    model?: string;
  } = {},
): ToolLike<T> {
  if (!options.repair || !options.retry) {
    return toolDef;
  }

  const retry = options.retry;

  return {
    ...toolDef,
    execute: async (input: T) => {
      const result = await repairToolCall(toolDef.parameters, input, retry, {
        maxAttempts: options.maxAttempts,
        logger: options.logger,
        schemaName: options.schemaName,
        model: options.model,
      });

      if (result.success) {
        return toolDef.execute(result.data);
      }

      throw new Error(
        `tool call failed validation after ${options.maxAttempts ?? 3} attempts: ${result.attempts
          .at(-1)
          ?.errors.join(", ")}`,
      );
    },
  };
}
