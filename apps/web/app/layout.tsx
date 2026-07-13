import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://callcheck.abhivarde.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "callcheck, the tool call reliability layer",
    template: "%s, callcheck",
  },
  description:
    "Validates AI tool call responses against a schema and auto repairs the ones that fail. Built on Zod, works with any model, free through Vercel AI Gateway.",
  keywords: [
    "AI tool calls",
    "tool call validation",
    "tool call repair",
    "schema validation",
    "zod",
    "AI SDK",
    "Vercel AI Gateway",
    "agent reliability",
    "structured output",
  ],
  authors: [{ name: "Abhi Varde", url: "https://abhivarde.in" }],
  openGraph: {
    title: "callcheck, the tool call reliability layer",
    description:
      "Validates AI tool call responses against a schema and auto repairs the ones that fail before your agent acts on them.",
    url: siteUrl,
    siteName: "callcheck",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "callcheck, the tool call reliability layer",
    description:
      "Validates AI tool call responses against a schema and auto repairs the ones that fail.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
