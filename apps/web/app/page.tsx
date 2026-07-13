"use client";

import { useState } from "react";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import { CopyIcon } from "@/components/ui/copy";
import { CheckIcon } from "@/components/ui/check";
import { GithubIcon } from "@/components/ui/github";
import { LayersIcon } from "@/components/ui/layers";
import { SparklesIcon } from "@/components/ui/sparkles";
import { MessageCircleIcon } from "@/components/ui/message-circle";
import { BoxIcon } from "@/components/ui/box";
import { PlugZapIcon } from "@/components/ui/plug-zap";
import { ZapIcon } from "@/components/ui/zap";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g callcheck");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-mono font-semibold">
          <ShieldCheckIcon size={20} className="text-neutral-500" />
          callcheck
        </div>
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="/docs" className="hover:text-white transition-colors">
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

      <section className="max-w-7xl mx-auto px-8 pt-14 pb-16">
        <h1 className="font-sans text-5xl font-semibold leading-tight max-w-2xl tracking-tight">
          Bad tool calls fix themselves before your code sees them.
        </h1>
        <p className="mt-4 text-base text-neutral-400 max-w-2xl">
          callcheck validates AI tool call responses against a schema, and auto
          repairs the ones that fail. No hand rolled retry logic, no model lock
          in, no subscription required.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 pl-4 pr-2 py-2 font-mono text-sm w-fit">
          <span className="text-neutral-500">$</span>
          npm install -g callcheck
          <button
            onClick={handleCopy}
            aria-label="Copy install command"
            className="ml-1 p-1.5 rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            {copied ? (
              <CheckIcon size={14} className="text-green-400" />
            ) : (
              <CopyIcon size={14} className="text-neutral-500" />
            )}
          </button>
        </div>

        <Card className="mt-12 border-neutral-800 bg-neutral-900 p-1">
          <div className="rounded-md bg-black p-6 font-mono text-sm">
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-4">
              <span>command callcheck check --repair</span>
              <span className="text-green-500 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-green-500" /> ready
              </span>
            </div>
            <div className="text-neutral-300 space-y-1">
              <p>
                <span className="text-neutral-500">$</span> callcheck check
                --schema user.json --response bad.json --repair
              </p>
              <p className="text-red-400">attempt 1 failed</p>
              <p className="text-neutral-500"> - email: invalid email format</p>
              <p className="text-neutral-500"> - plan: invalid enum value</p>
              <p className="text-green-400">
                ✔ repaired response now matches schema
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Separator className="bg-neutral-900" />

      <section className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight">
            Define the shape once.
          </h2>
          <p className="mt-3 text-base text-neutral-400">
            Nested objects, enums, constraints. callcheck checks the full
            response against your real schema, not a simplified version of it.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-neutral-400">
            <li className="flex items-center gap-2.5">
              <LayersIcon size={15} className="text-neutral-500 shrink-0" />{" "}
              built on Zod, no new schema language to learn
            </li>
            <li className="flex items-center gap-2.5">
              <SparklesIcon size={15} className="text-neutral-500 shrink-0" />{" "}
              works with any AI provider, not tied to one model
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircleIcon
                size={15}
                className="text-neutral-500 shrink-0"
              />{" "}
              readable errors, not a stack trace
            </li>
          </ul>
        </div>
        <Card className="border-neutral-800 bg-neutral-900 p-5 font-mono text-sm">
          <p className="text-neutral-300">const schema = z.object({"{"}</p>
          <p className="text-neutral-300 pl-4">userId: z.string(),</p>
          <p className="text-neutral-300 pl-4">
            plan: z.enum([&quot;free&quot;, &quot;pro&quot;,
            &quot;enterprise&quot;]),
          </p>
          <p className="text-neutral-300 pl-4">
            usage: z.object({"{"} requests: z.number() {"}"}),
          </p>
          <p className="text-neutral-300">{"}"});</p>
        </Card>
      </section>

      <Separator className="bg-neutral-900" />

      <section className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
        <Card className="border-neutral-800 bg-neutral-900 p-5 font-mono text-sm order-2 md:order-1">
          <p className="text-neutral-500 text-xs mb-3">
            wrap a tool once, repair every call automatically
          </p>
          <p className="text-neutral-300">const tool = validated(</p>
          <p className="text-neutral-300 pl-4">queryUserTool,</p>
          <p className="text-neutral-300 pl-4">
            {"{"} repair: true, retry: gatewayRetry(key) {"}"}
          </p>
          <p className="text-neutral-300">);</p>
        </Card>
        <div className="order-1 md:order-2">
          <h2 className="font-sans text-2xl font-semibold tracking-tight">
            Not just a CLI.
          </h2>
          <p className="mt-3 text-base text-neutral-400">
            Import callcheck in TypeScript, wrap any tool definition, and every
            call through it gets validated and repaired without extra code
            downstream.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-neutral-400">
            <li className="flex items-center gap-2.5">
              <BoxIcon size={15} className="text-neutral-500 shrink-0" /> npm
              package or standalone CLI, same core
            </li>
            <li className="flex items-center gap-2.5">
              <PlugZapIcon size={15} className="text-neutral-500 shrink-0" />{" "}
              works outside AI SDK too, framework agnostic by design
            </li>
            <li className="flex items-center gap-2.5">
              <ZapIcon size={15} className="text-neutral-500 shrink-0" /> free
              repair calls through Vercel AI Gateway, no subscription
            </li>
          </ul>
        </div>
      </section>

      <Separator className="bg-neutral-900" />

      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="font-sans text-2xl font-semibold tracking-tight mb-2">
          Built for agent workflows.
        </h2>
        <p className="text-base text-neutral-400 max-w-2xl mb-10">
          Not a logging tool. A repair layer between what your agent gets back
          and what your code trusts.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              n: "001",
              title: "Validate",
              desc: "Zod based checks on every field, including nested objects.",
            },
            {
              n: "002",
              title: "Repair",
              desc: "Failing responses get a fix prompt and a retry, automatically.",
            },
            {
              n: "003",
              title: "Wrap once",
              desc: "validated() wraps a tool, every call after that is protected.",
            },
            {
              n: "004",
              title: "Track failures",
              desc: "Every attempt logs which field and which model broke.",
            },
          ].map((f) => (
            <div key={f.n}>
              <p className="text-xs text-neutral-600 font-mono mb-3">{f.n}</p>
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-neutral-900" />

      <footer className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid md:grid-cols-4 gap-8 text-sm mb-10">
          <div>
            <p className="font-mono font-semibold mb-2">callcheck</p>
            <p className="text-neutral-500 text-sm">
              Validate and auto repair tool call responses before your agent
              acts on them.
            </p>
          </div>
          <div>
            <p className="text-neutral-600 text-xs mb-3 tracking-wide">USAGE</p>
            <div className="space-y-2 font-mono text-neutral-400 text-sm">
              <p>callcheck check</p>
              <p>callcheck report</p>
              <p>callcheck --version</p>
            </div>
          </div>
          <div>
            <p className="text-neutral-600 text-xs mb-3 tracking-wide">
              FEATURES
            </p>
            <div className="space-y-2 text-neutral-400 text-sm">
              <p>schema validation</p>
              <p>auto repair</p>
              <p>failure tracking</p>
            </div>
          </div>
          <div>
            <p className="text-neutral-600 text-xs mb-3 tracking-wide">LINKS</p>
            <div className="space-y-2 text-neutral-400 text-sm">
              <a
                href="/docs"
                className="block hover:text-white transition-colors"
              >
                Docs
              </a>
              <a
                href="https://github.com/abhivarde/callcheck"
                className="block hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
