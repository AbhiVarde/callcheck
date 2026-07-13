import { RetryFn } from "./repair.js";

export function gatewayRetry(
  apiKey: string,
  model = "openai/gpt-4o-mini",
): RetryFn {
  return async (prompt: string) => {
    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`gateway request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
  };
}
