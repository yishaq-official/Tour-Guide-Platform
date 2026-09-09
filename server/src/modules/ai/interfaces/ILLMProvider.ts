export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface ILLMProvider {
  complete(prompt: string, options?: LLMCompletionOptions): Promise<string>;
  chat(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string>;
  streamChat?(
    messages: LLMMessage[],
    onToken: (token: string) => void,
    options?: LLMCompletionOptions
  ): Promise<void>;
}
