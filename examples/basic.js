import { LLMJsonGuard } from "../index.js";


const guard = new LLMJsonGuard();

// Example malformed JSON from an LLM
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

// Sanitize only
const sanitized = guard.sanitize(rawOutput);
console.log("Sanitized Result:");
console.log(JSON.stringify(sanitized, null, 2));

// Sanitize + Validate
const validated = guard.guard(rawOutput, schema);
console.log("\nValidated Result:");
console.log(JSON.stringify(validated, null, 2));