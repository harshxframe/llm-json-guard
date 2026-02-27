# Updated README.md (Final Version)

````markdown
# llm-json-guard

Production-safe JSON repair and schema validation for LLM outputs.

Large Language Models frequently return malformed JSON containing:
- Missing quotes
- Trailing commas
- Invalid tokens
- Broken object structures

This package provides a lightweight wrapper around a production-grade JSON repair and validation API, allowing you to sanitize and enforce schema validation in seconds.

---

## Installation

```bash
npm install llm-json-guard
````

---

## Requirements

* Node.js 18+
* RapidAPI key

Get your API key here:
[(https://rapidapi.com/scotedflotsincoltd/api/llm-json-sanitizer-schema-guard)](https://rapidapi.com/scotedflotsincoltd/api/llm-json-sanitizer-schema-guard)

---

## Basic Usage

```js
import { LLMJsonGuard } from "llm-json-guard";

const guard = new LLMJsonGuard({
  apiKey: process.env.RAPIDAPI_KEY
});

// Sanitize only
const sanitized = await guard.sanitize("{name: 'Harsh', age: 21,}");
console.log(sanitized.data);

// Sanitize + Validate
const validated = await guard.guard(
  "{name: 'Harsh', age: 21,}",
  {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number" }
    },
    required: ["name", "age"]
  }
);

console.log(validated.data);
```

---

## API Methods

### sanitize(rawOutput)

Repairs malformed JSON and returns safely parsed output.

Returns:

* `success`
* `stage`
* `meta` (repair status + confidence)
* `data`
* `errors`

---

### guard(rawOutput, schema)

Repairs malformed JSON and validates it against a JSON Schema.

Returns:

* `validated` stage if schema passes
* `validation_failed` if schema check fails
* structured validation errors

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

## When To Use

* AI agents generating structured output
* RAG pipelines
* Backend systems consuming LLM JSON
* Automation workflows
* Webhook normalization
* Contract enforcement

If your system depends on structured AI output, this acts as a guardrail between the LLM and your production logic.

---

## License

MIT

````

---

