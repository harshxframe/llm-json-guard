import { jsonrepair } from "jsonrepair";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

class LLMJsonGuard {
  constructor() {}

  sanitize(rawOutput) {
    if (!rawOutput) {
      throw new Error("rawOutput is required");
    }

    return this.#safeParse(rawOutput);
  }

  guard(rawOutput, schema) {
    if (!rawOutput || !schema) {
      throw new Error("rawOutput and schema are required");
    }

    return this.#safeParse(rawOutput, schema);
  }

  #safeParse(rawOutput, schema) {
    let parsedData;
    let repaired = false;
    let stage = "initial";
    let confidence = 1;

    // Try normal parse
    try {
      parsedData = JSON.parse(rawOutput);
    } catch (err) {
      stage = "repair_attempt";

      try {
        const repairedString = jsonrepair(rawOutput);

        // Strictness / Confidence Check
        const lengthDiff = Math.abs(
          repairedString.length - rawOutput.length
        );

        const modificationRatio = rawOutput.length
          ? lengthDiff / rawOutput.length
          : 1;

        confidence = Math.max(0, 1 - modificationRatio);

        parsedData = JSON.parse(repairedString);
        repaired = true;

        if (modificationRatio > 0.5) {
          return {
            success: false,
            stage: "repair_suspicious",
            meta: { repaired: true, confidence },
            errors: [
              {
                type: "repair",
                message:
                  "Repair modified input heavily. Structure may be unreliable."
              }
            ]
          };
        }

      } catch (repairErr) {
        return {
          success: false,
          stage: "parse_failed",
          meta: { repaired: false, confidence: 0 },
          errors: [
            {
              type: "syntax",
              message: repairErr.message
            }
          ]
        };
      }
    }

    // Validate against schema (if provided)
    if (schema && Object.keys(schema).length > 0) {
      const validate = ajv.compile(schema); // keeping same behavior (no caching)
      const valid = validate(parsedData);

      if (!valid) {
        return {
          success: false,
          stage: "validation_failed",
          meta: { repaired, confidence },
          errors: validate.errors
        };
      }
    }

    //  Success
    return {
      success: true,
      stage: schema ? "validated" : "parsed_only",
      meta: { repaired, confidence },
      data: parsedData,
      errors: []
    };
  }
}

export { LLMJsonGuard };