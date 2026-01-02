import { Message as AIMessage } from './aiService';
import { aiService } from './aiService';

export interface Message extends AIMessage {
  id: string;
  display: boolean;
}

export interface AIServiceManagerConfig {
  onStream?: (chunk: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export class AIServiceManager {
  private messages: Message[] = [];
  private isLoading = false;
  private config: AIServiceManagerConfig = {};
  private abortController: AbortController | null = null;

  constructor(config?: AIServiceManagerConfig) {
    this.config = config || {};
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  addMessage(content: string, role: 'user' | 'assistant' | 'system', display: boolean = true): string {
    const id = this.generateId();
    const message: Message = {
      id,
      role,
      content,
      display,
      timestamp: new Date().toISOString()
    };
    this.messages.push(message);
    return id;
  }

  addUserMessage(content: string, display: boolean = true): string {
    return this.addMessage(content, 'user', display);
  }

  addAssistantMessage(content: string, display: boolean = true): string {
    return this.addMessage(content, 'assistant', display);
  }

  addSystemMessage(content: string, display: boolean = false): string {
    return this.addMessage(content, 'system', display);
  }

  setMessageDisplay(id: string, display: boolean): boolean {
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.display = display;
      return true;
    }
    return false;
  }

  getDisplayMessages(): Message[] {
    return this.messages.filter(m => m.display);
  }

  getAllMessages(): Message[] {
    return [...this.messages];
  }

  getMessagesForAI(): AIMessage[] {
    return this.messages.map(({ id, display, ...msg }) => msg);
  }

  isRequestLoading(): boolean {
    return this.isLoading;
  }

  async sendToAI(): Promise<void> {
    if (this.isLoading) {
      throw new Error('AI request already in progress');
    }

    if (this.messages.length === 0) {
      throw new Error('No messages to send');
    }

    this.isLoading = true;
    this.abortController = new AbortController();

    const assistantMessageId = this.addAssistantMessage('', true);
    let assistantContent = '';

    const timeoutId = setTimeout(() => {
      this.abort();
      const error = new Error('连接超时');
      this.config.onError?.(error);
      this.isLoading = false;
    }, 25000);

    try {
      await aiService.chat(
        this.getMessagesForAI(),
        (chunk) => {
          assistantContent += chunk;
          this.updateMessageContent(assistantMessageId, assistantContent);
          this.config.onStream?.(chunk);
        },
        () => {
          clearTimeout(timeoutId);
          this.isLoading = false;
          this.config.onComplete?.();
        },
        (error) => {
          clearTimeout(timeoutId);
          this.isLoading = false;
          
          if (error.name === 'AbortError') {
            return;
          }
          
          const errorMessage = error.message === '连接超时' 
            ? '连接超时，请稍后再试。' 
            : '抱歉，我无法回应。请稍后再试。';
          
          this.updateMessageContent(assistantMessageId, errorMessage);
          this.config.onError?.(error);
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);
      this.isLoading = false;
      this.config.onError?.(error as Error);
    }
  }

  private updateMessageContent(id: string, content: string): void {
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.content = content;
    }
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isLoading = false;
  }

  clearMessages(): void {
    this.messages = [];
    this.abort();
  }

  removeMessage(id: string): boolean {
    const index = this.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }
}