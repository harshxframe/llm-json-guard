# llm-json-guard

Deterministic JSON repair and schema validation for LLM outputs.

Large Language Models frequently return malformed JSON containing:

- Missing quotes  
- Trailing commas  
- Invalid tokens  
- Broken object structures  

`llm-json-guard` repairs malformed JSON and optionally validates it against a JSON Schema — locally, instantly, and without network dependencies.

---

## Installation

```bash
npm install llm-json-guard
```

---

## Requirements

- Node.js 18+
- ESM environment (`"type": "module"` in package.json)

No API keys.  
No external services.  
Runs fully local inside your application.

---

## Why Use This?

LLMs do not guarantee valid JSON. Even a single trailing comma can crash production systems.

This package provides:

- Deterministic JSON repair (no extra model calls)
- Confidence scoring based on repair intensity
- Optional JSON Schema validation (AJV)
- Structured error responses
- Production-safe output handling

It acts as a reliability layer between your LLM and your business logic.

---

## Quick Example

```js
import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard();

const rawOutput = `
{
  name: "Harsh",
  age: 21,
}
`;

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" }
  },
  required: ["name", "age"]
};

// Repair only
const sanitized = guard.sanitize(rawOutput);
console.log("Sanitized:", sanitized);

// Repair + Validate
const validated = guard.guard(rawOutput, schema);
console.log("Validated:", validated);
```

---

## Run Local Example (From Repository)

```bash
git clone https://github.com/harshxframe/llm-json-guard.git
cd llm-json-guard
npm install
node examples/basic.js
```

---

## API Methods

### `sanitize(rawOutput)`

Repairs malformed JSON and safely parses it.

Returns:

- `success`
- `stage`
- `meta` (repair status + confidence)
- `data`
- `errors`

---

### `guard(rawOutput, schema)`

Repairs malformed JSON and validates it against a JSON Schema.

Returns:

- `validated` stage if schema passes
- `validation_failed` if schema check fails
- Structured validation errors

---

## Response Structure

Example successful response:

```json
{
  "success": true,
  "stage": "validated",
  "meta": {
    "repaired": true,
    "confidence": 0.95
  },
  "data": {
    "name": "Harsh",
    "age": 21
  },
  "errors": []
}
```

---

## Failure Stages

The package clearly indicates failure states:

- `parse_failed` — JSON could not be repaired
- `repair_suspicious` — Repair heavily modified input
- `validation_failed` — Schema validation failed

This ensures your application can safely branch logic based on reliability.

---

## When To Use

- AI agents generating structured output
- RAG pipelines
- Backend systems consuming LLM JSON
- Automation workflows
- Webhook normalization
- Contract enforcement

If your system depends on structured AI output, this acts as a guardrail between the LLM and your production logic.

---

## License

MIT