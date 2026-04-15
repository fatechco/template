interface LLMOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export async function invokeLLM(
  prompt: string,
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const {
    model = "claude-sonnet-4-20250514",
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  const messages: Array<{ role: string; content: string }> = [];

  if (systemPrompt) {
    messages.push({ role: "user", content: `${systemPrompt}\n\n${prompt}` });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return {
    content: data.content?.[0]?.text || "",
    usage: {
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    },
  };
}

export async function invokeLLMWithSchema<T>(
  prompt: string,
  schema: Record<string, unknown>,
  options: LLMOptions = {}
): Promise<T> {
  const enhancedPrompt = `${prompt}\n\nRespond ONLY with valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}`;

  const result = await invokeLLM(enhancedPrompt, {
    ...options,
    temperature: options.temperature ?? 0.3,
  });

  try {
    return JSON.parse(result.content) as T;
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error("Failed to parse LLM response as JSON");
  }
}
