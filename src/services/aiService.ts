const MODEL = 'Pro/deepseek-ai/DeepSeek-V3.2';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  visible?: boolean;
}

export interface AIResponse {
  content: string;
  done: boolean;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_AI_BASE_URL || 'https://api.openai.com/v1';

    if (!this.apiKey) {
      console.warn('AI API key not configured');
    }
  }

  async chat(
    messages: Message[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (!this.apiKey) {
      onError(new Error('AI API key not configured'));
      return;
    }

    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      this.abortController?.abort();
      onError(new Error('连接超时'));
    }, 25000);

    const debugMessage = (msg, enable) => enable && console.log(`[AIService] ${msg}`);
    const payload = {
      model: MODEL,
      messages,
      stream: true
    };
    debugMessage(`Request payload: ${JSON.stringify(payload, null, 2)}`, false);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                onChunk(content);
              }
            } catch (e) {
            }
          }
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const aiService = new AIService();
