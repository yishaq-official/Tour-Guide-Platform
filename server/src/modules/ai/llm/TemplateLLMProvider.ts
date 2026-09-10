import type {
  ILLMProvider,
  LLMCompletionOptions,
  LLMMessage,
} from "../interfaces/ILLMProvider.js";

/**
 * Template-based fallback LLM provider.
 * Implements ILLMProvider to fulfill the AI Subsystem architecture
 * cleanly without requiring paid external LLM accounts during development/testing.
 */
export class TemplateLLMProvider implements ILLMProvider {
  async complete(prompt: string, _options?: LLMCompletionOptions): Promise<string> {
    return `TravelAssist AI Assistant response for: "${prompt.slice(0, 50)}..."`;
  }

  async chat(messages: LLMMessage[], _options?: LLMCompletionOptions): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const query = lastUserMessage?.content || "Ethiopia travel";

    return (
      `TravelAssist AI Assistant:\n\nRegarding "${query}", Ethiopia provides an incredible range ` +
      `of UNESCO world heritage sites, rich ancient cultural traditions, and reliable travel services. ` +
      `Explore our curated hotel options and local car rentals to coordinate your journey smoothly.`
    );
  }

  async streamChat(
    messages: LLMMessage[],
    onToken: (token: string) => void,
    options?: LLMCompletionOptions
  ): Promise<void> {
    const fullText = await this.chat(messages, options);
    const words = fullText.split(" ");

    for (const word of words) {
      onToken(word + " ");
      // Brief simulated streaming latency
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
}

export const templateLLMProvider = new TemplateLLMProvider();
