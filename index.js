class LLMJsonGuard {
  constructor({ apiKey }) {
    if (!apiKey) {
      throw new Error("RapidAPI key is required");
    }

    this.apiKey = apiKey;
    this.baseUrl =
      "https://llm-json-sanitizer-schema-guard.p.rapidapi.com";
  }

  async sanitize(rawOutput) {
    if (!rawOutput) {
      throw new Error("rawOutput is required");
    }

    return this.#request("/api/json-repair/sanitize", {
      raw_output: rawOutput
    });
  }

  async guard(rawOutput, schema) {
    if (!rawOutput || !schema) {
      throw new Error("rawOutput and schema are required");
    }

    return this.#request("/api/json-repair/guard", {
      raw_output: rawOutput,
      schema
    });
  }

  async #request(path, body) {
    const response = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host":
          "llm-json-sanitizer-schema-guard.p.rapidapi.com"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.data?.response?.stage ||
        data?.message ||
        "Request failed";
      throw new Error(message);
    }

    return data.data.response;
  }
}

export { LLMJsonGuard };