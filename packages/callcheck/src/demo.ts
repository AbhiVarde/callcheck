import { z } from "zod";
import { repairToolCall, consoleLogger } from "./index.js";

const queryUserSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  plan: z.enum(["free", "pro", "enterprise"]),
  usage: z.object({
    requests: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
  }),
  status: z.enum(["active", "suspended", "pending"]),
});

const badResponse = {
  userId: "usr_9f2a",
  email: "not-a-valid-email",
  plan: "premium",
  usage: {
    requests: "1200",
    limit: 5000,
  },
  status: "active",
  extraField: "hallucinated by the model",
};

let call = 0;

const flakyModel = async (prompt: string) => {
  call++;
  console.log(`\nmodel call ${call}, prompt sent:`);
  console.log(prompt);

  if (call === 1) {
    return {
      userId: "usr_9f2a",
      email: "dev@company.com",
      plan: "premium",
      usage: { requests: "1200", limit: 5000 },
      status: "active",
    };
  }

  return {
    userId: "usr_9f2a",
    email: "dev@company.com",
    plan: "pro",
    usage: { requests: 1200, limit: 5000 },
    status: "active",
  };
};

async function run() {
  console.log("case: model needs two attempts to fully fix a nested response");
  const result = await repairToolCall(
    queryUserSchema,
    badResponse,
    flakyModel,
    {
      maxAttempts: 3,
      logger: consoleLogger(),
      schemaName: "queryUser",
      model: "demo-model",
    },
  );
  console.log("\nresult:", result);

  console.log("\ncase: model never fixes it, exhausts attempts");
  call = 0;
  const neverFixes = async () => ({ ...badResponse });
  const failed = await repairToolCall(
    queryUserSchema,
    badResponse,
    neverFixes,
    {
      maxAttempts: 2,
      logger: consoleLogger(),
      schemaName: "queryUser",
      model: "demo-model",
    },
  );
  console.log(failed);
}

run();
