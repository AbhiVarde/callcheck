import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { LoggedRun, Logger } from "./logger.js";

const DEFAULT_PATH = ".callcheck/runs.json";

function ensureFile(path: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(path)) {
    writeFileSync(path, "[]", "utf-8");
  }
}

export function readRuns(path = DEFAULT_PATH): LoggedRun[] {
  ensureFile(path);
  const raw = readFileSync(path, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendRun(run: LoggedRun, path = DEFAULT_PATH): void {
  const runs = readRuns(path);
  runs.push(run);
  writeFileSync(path, JSON.stringify(runs, null, 2), "utf-8");
}

export function fileLogger(path = DEFAULT_PATH): Logger {
  return {
    log: async (run: LoggedRun) => {
      appendRun(run, path);
    },
  };
}
