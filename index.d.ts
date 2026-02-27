export interface GuardMeta {
  repaired: boolean;
  confidence: number;
}

export interface GuardResponse<T = any> {
  success: boolean;
  stage: string;
  meta: GuardMeta;
  data?: T;
  errors: any[];
}

export class LLMJsonGuard {
  constructor(config: { apiKey: string });

  sanitize(rawOutput: string): Promise<GuardResponse>;

  guard(
    rawOutput: string,
    schema: object
  ): Promise<GuardResponse>;
}