#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "fs";
import { z } from "zod";
import {
  validateToolCall,
  repairToolCall,
  gatewayRetry,
  fileLogger,
  readRuns,
  buildReport,
  printReport,
} from "./index.js";

const program = new Command();

program
  .name("callcheck")
  .description(
    "Validates tool call responses against a schema before an agent acts on them.",
  )
  .version("0.1.0");

type FieldDef =
  | "string"
  | "email"
  | "number"
  | "boolean"
  | { type: "enum"; values: string[] }
  | { type: "number"; positive?: boolean; int?: boolean };

function buildZodShape(
  schemaShape: Record<string, FieldDef>,
): Record<string, z.ZodTypeAny> {
  const zodShape: Record<string, z.ZodTypeAny> = {};

  for (const key in schemaShape) {
    const field = schemaShape[key];

    if (field === "string") {
      zodShape[key] = z.string();
    } else if (field === "email") {
      zodShape[key] = z.string().email();
    } else if (field === "number") {
      zodShape[key] = z.number();
    } else if (field === "boolean") {
      zodShape[key] = z.boolean();
    } else if (typeof field === "object" && field.type === "enum") {
      zodShape[key] = z.enum(field.values as [string, ...string[]]);
    } else if (typeof field === "object" && field.type === "number") {
      let num = z.number();
      if (field.positive) num = num.positive();
      if (field.int) num = num.int();
      zodShape[key] = num;
    } else {
      zodShape[key] = z.any();
    }
  }

  return zodShape;
}

program
  .command("check")
  .description("Validate a JSON response file against a JSON schema file")
  .requiredOption(
    "-s, --schema <path>",
    "path to a JSON file describing the expected shape",
  )
  .requiredOption(
    "-r, --response <path>",
    "path to the JSON response you want to validate",
  )
  .option(
    "--repair",
    "attempt to auto correct a failing response using AI Gateway",
  )
  .option(
    "--model <name>",
    "gateway model to use for repair",
    "openai/gpt-4o-mini",
  )
  .option("--max-attempts <n>", "max repair attempts before giving up", "3")
  .action(async (options) => {
    const schemaShape = JSON.parse(readFileSync(options.schema, "utf-8"));
    const response = JSON.parse(readFileSync(options.response, "utf-8"));
    const schema = z.object(buildZodShape(schemaShape));

    if (!options.repair) {
      const result = validateToolCall(schema, response);

      if (result.success) {
        console.log("✔ passed  response matches schema");
        console.log(result.data);
        process.exit(0);
      } else {
        console.log("✘ failed  response does not match schema");
        result.errors.forEach((e) => console.log("  -", e));
        process.exit(1);
      }
      return;
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY;

    if (!apiKey) {
      console.log("✘ AI_GATEWAY_API_KEY not set, cannot run --repair");
      console.log(
        "get a free key at vercel.com/ai-gateway, no model subscription needed",
      );
      process.exit(1);
    }

    const retry = gatewayRetry(apiKey, options.model);

    const result = await repairToolCall(schema, response, retry, {
      maxAttempts: parseInt(options.maxAttempts, 10),
      logger: fileLogger(),
      schemaName: options.schema,
      model: options.model,
    });

    result.attempts.forEach((a) => {
      console.log(`attempt ${a.attempt}  failed`);
      a.errors.forEach((e) => console.log("  -", e));
    });

    if (result.success) {
      console.log("✔ repaired  response now matches schema");
      console.log(result.data);
      process.exitCode = 0;
    } else {
      console.log("✘ repair failed  gave up after max attempts");
      process.exitCode = 1;
    }
  });

program
  .command("report")
  .description("Show a summary of past repair runs")
  .action(() => {
    const runs = readRuns();
    if (runs.length === 0) {
      console.log("no runs logged yet, run callcheck check --repair first");
      return;
    }
    const summary = buildReport(runs);
    printReport(summary);
  });

program.parse();
