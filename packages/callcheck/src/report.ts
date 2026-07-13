import { LoggedRun } from "./logger.js";

export type ReportSummary = {
  totalRuns: number;
  successRate: number;
  byModel: Record<string, { total: number; success: number }>;
  byField: Record<string, number>;
};

export function buildReport(runs: LoggedRun[]): ReportSummary {
  const byModel: Record<string, { total: number; success: number }> = {};
  const byField: Record<string, number> = {};

  for (const run of runs) {
    if (!byModel[run.model]) {
      byModel[run.model] = { total: 0, success: 0 };
    }
    byModel[run.model].total++;
    if (run.success) byModel[run.model].success++;

    for (const field of run.failedFields) {
      byField[field] = (byField[field] ?? 0) + 1;
    }
  }

  const successCount = runs.filter((r) => r.success).length;

  return {
    totalRuns: runs.length,
    successRate: runs.length ? successCount / runs.length : 0,
    byModel,
    byField,
  };
}

export function printReport(summary: ReportSummary): void {
  console.log(`total runs: ${summary.totalRuns}`);
  console.log(`success rate: ${(summary.successRate * 100).toFixed(1)}%`);

  console.log("\nby model:");
  for (const [model, stats] of Object.entries(summary.byModel)) {
    const rate = ((stats.success / stats.total) * 100).toFixed(1);
    console.log(`  ${model}  ${stats.success}/${stats.total}  ${rate}%`);
  }

  console.log("\nfields that fail most:");
  const sorted = Object.entries(summary.byField).sort((a, b) => b[1] - a[1]);
  for (const [field, count] of sorted) {
    console.log(`  ${field}  ${count}`);
  }
}
