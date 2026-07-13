# callcheck

**The tool call reliability layer.**

Validates AI tool call responses against a schema and auto repairs the ones that fail, so broken JSON never reaches your agent's next step. Built on [Zod](https://zod.dev), works with any model, free repair calls through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).

## Install
```

npm install callcheck

````

## Why

Agents call tools, tools return json, sometimes the json is the wrong shape. Wrong type, missing field, bad enum value. callcheck catches that at the boundary and tries to fix it before your code has to deal with it.

## Validate

```typescript
import { validateToolCall, z } from "callcheck";

const orderSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
});

const result = validateToolCall(orderSchema, response);

if (!result.success) {
  console.log(result.errors);
}
````

## Repair

```typescript
import { repairToolCall, gatewayRetry } from "callcheck";

const retry = gatewayRetry(process.env.AI_GATEWAY_API_KEY);

const result = await repairToolCall(orderSchema, badResponse, retry, {
  maxAttempts: 3,
});
```

Sends the validation errors back to a model, asks for a corrected response, checks again, retries up to the limit.

## Wrap a tool once

```typescript
import { validated, gatewayRetry } from "callcheck";

const tool = validated(myTool, {
  repair: true,
  retry: gatewayRetry(process.env.AI_GATEWAY_API_KEY),
});
```

Every call through the wrapped tool gets validated and repaired automatically, no extra code downstream.

## CLI

```
callcheck check --schema schema.json --response response.json
callcheck check --schema schema.json --response response.json --repair
callcheck report
```

`report` reads logged repair runs from `.callcheck/runs.json` and shows which fields and which models fail most.

## Schema file format

```json
{
  "userId": "string",
  "email": "email",
  "plan": { "type": "enum", "values": ["free", "pro", "enterprise"] },
  "quantity": { "type": "number", "positive": true, "int": true }
}
```

## License

MIT