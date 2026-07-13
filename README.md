# callcheck

**The tool call reliability layer.**

Validates AI tool call responses against a schema and auto repairs the ones that fail, before your agent acts on them.

```bash
npm install callcheck
```

→ Zod based schema validation, no new schema language to learn
→ Auto repair failing responses using any model
→ Wrap a tool once, every call after is protected
→ Free repair calls through Vercel AI Gateway, no separate subscription
→ Framework agnostic, works with any AI provider
→ Local failure tracking, see which fields and models break most

## Usage

```bash
callcheck check --schema schema.json --response response.json
callcheck check --schema schema.json --response response.json --repair
callcheck report
```

```typescript
import { validated, gatewayRetry } from "callcheck";

const tool = validated(myTool, {
  repair: true,
  retry: gatewayRetry(process.env.AI_GATEWAY_API_KEY),
});
```

## Repo layout

```
packages/callcheck   the npm package and CLI
apps/web             landing page and docs, callcheck.abhivarde.in
```

## Docs

Full usage docs at [callcheck.abhivarde.in/docs](https://callcheck.abhivarde.in/docs)

## License

MIT
