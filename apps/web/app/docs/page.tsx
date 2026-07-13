"use client";

import { useState } from "react";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import { GithubIcon } from "@/components/ui/github";
import { CheckIcon } from "@/components/ui/check";
import { CopyIcon } from "@/components/ui/copy";
import { DownloadIcon } from "@/components/ui/download";
import { TerminalIcon } from "@/components/ui/terminal";
import { WorkflowIcon } from "@/components/ui/workflow";
import { RocketIcon } from "@/components/ui/rocket";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-lg border border-neutral-800 bg-neutral-950">
      <pre className="p-4 pr-12 font-mono text-sm text-neutral-300 overflow-x-auto">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
      >
        {copied ? (
          <CheckIcon size={14} className="text-green-400" />
        ) : (
          <CopyIcon size={14} className="text-neutral-500" />
        )}
      </button>
    </div>
  );
}

export default function Docs() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <a
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold"
        >
          <ShieldCheckIcon size={16} className="text-neutral-500" />
          callcheck
        </a>
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="/docs" className="text-white">
            Docs
          </a>
          <a
            href="https://github.com/abhivarde/callcheck"
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <GithubIcon size={18} />
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-16 space-y-16">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <RocketIcon size={20} className="text-neutral-500" />
            <h1 className="font-sans text-4xl font-semibold tracking-tight">
              Introduction
            </h1>
          </div>
          <p className="text-neutral-400">
            callcheck validates AI tool call responses against a schema and auto
            repairs the ones that fail. Built on Zod, works with any AI
            provider, free through Vercel AI Gateway.
          </p>
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <DownloadIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Install
            </h2>
          </div>
          <CodeBlock code="npm install -g callcheck" />
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <TerminalIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Schema file
            </h2>
          </div>
          <p className="text-neutral-400 mb-4">
            Describe the expected shape of a tool call response in a JSON file.
            Supports string, number, boolean, email, plus enums and number
            constraints.
          </p>
          <CodeBlock
            code={`{
  "userId": "string",
  "email": "email",
  "plan": { "type": "enum", "values": ["free", "pro", "enterprise"] },
  "status": { "type": "enum", "values": ["active", "suspended", "pending"] }
}`}
          />
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <TerminalIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Run a check
            </h2>
          </div>
          <CodeBlock code="callcheck check --schema schema.json --response response.json" />
          <p className="text-neutral-400 mt-4 mb-4">
            A valid response returns:
          </p>
          <Card className="border-neutral-800 bg-neutral-900 p-4 font-mono text-sm">
            <div className="text-green-400 flex items-center gap-2">
              <CheckIcon size={14} /> passed response matches schema
            </div>
          </Card>
          <p className="text-neutral-400 mt-4 mb-4">
            An invalid response returns:
          </p>
          <Card className="border-neutral-800 bg-neutral-900 p-4 font-mono text-sm space-y-1">
            <p className="text-red-400">
              ✘ failed response does not match schema
            </p>
            <p className="text-neutral-500"> - email: invalid email format</p>
            <p className="text-neutral-500"> - plan: invalid enum value</p>
          </Card>
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <WorkflowIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Auto repair
            </h2>
          </div>
          <p className="text-neutral-400 mb-4">
            Add --repair to send a failing response to a model for correction.
            Requires a free AI Gateway key, no separate model subscription
            needed.
          </p>
          <CodeBlock code="callcheck check --schema schema.json --response response.json --repair" />
          <p className="text-neutral-400 mt-4 mb-4">
            Set your key once per terminal session:
          </p>
          <CodeBlock code={`$env:AI_GATEWAY_API_KEY = "your-key-here"`} />
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <WorkflowIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Wrap a tool once
            </h2>
          </div>
          <p className="text-neutral-400 mb-4">
            In code, wrap any AI SDK style tool definition. Every call through
            it gets validated and repaired automatically after that, no extra
            code downstream.
          </p>
          <CodeBlock
            code={`import { validated, gatewayRetry } from "callcheck";

const queryUser = validated(queryUserTool, {
  repair: true,
  retry: gatewayRetry(process.env.AI_GATEWAY_API_KEY),
});`}
          />
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <TerminalIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Track failures
            </h2>
          </div>
          <p className="text-neutral-400 mb-4">
            Every repair run gets logged locally to .callcheck/runs.json. See
            which fields and which models fail most.
          </p>
          <CodeBlock code="callcheck report" />
        </section>

        <Separator className="bg-neutral-900" />

        <section>
          <div className="flex items-center gap-2 mb-3">
            <WorkflowIcon size={18} className="text-neutral-500" />
            <h2 className="font-sans text-2xl font-semibold tracking-tight">
              Use it in CI
            </h2>
          </div>
          <p className="text-neutral-400 mb-4">
            callcheck exits with a non zero code on failure, so it fits directly
            into a pipeline step.
          </p>
          <CodeBlock
            code={`- name: Validate tool response
  run: callcheck check --schema schema.json --response response.json`}
          />
        </section>
      </main>
    </div>
  );
}
