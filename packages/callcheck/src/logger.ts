import { randomUUID } from "node:crypto";
import { RepairAttempt } from "./repair.js";

export type LoggedRun = {
  id: string;
  schemaName: string;
  model: string;
  timestamp: string;
  success: boolean;
  totalAttempts: number;
  failedFields: string[];
  attempts: RepairAttempt[];
};

export type Logger = {
  log: (run: LoggedRun) => Promise<void>;
};

function extractFields(errors: string[]): string[] {
  return errors.map((e) => e.split(":")[0].trim());
}

export function buildLoggedRun(
  schemaName: string,
  model: string,
  attempts: RepairAttempt[],
  success: boolean,
): LoggedRun {
  const allErrors = attempts.flatMap((a) => a.errors);
  return {
    id: randomUUID(),
    schemaName,
    model,
    timestamp: new Date().toISOString(),
    success,
    totalAttempts: attempts.length,
    failedFields: [...new Set(extractFields(allErrors))],
    attempts,
  };
}

export function consoleLogger(): Logger {
  return {
    log: async (run: LoggedRun) => {
      console.log(JSON.stringify(run));
    },
  };
}
