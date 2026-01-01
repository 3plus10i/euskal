import { useState, useEffect, useRef } from 'react';
import { AIServiceManager, Message } from './aiServiceManager';

export interface UseAIServiceReturn {
  // 消息管理
  messages: Message[];
  addUserMessage: (content: string, display?: boolean) => string;
  addSystemMessage: (content: string, display?: boolean) => string;
  addAssistantMessage: (content: string, display?: boolean) => string;
  setMessageDisplay: (id: string, display: boolean) => boolean;
  clearMessages: () => void;
  
  // AI交互
  sendToAI: () => Promise<void>;
  abort: () => void;
  isLoading: boolean;
  error: Error | null;
}

export function useAIService(): UseAIServiceReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const managerRef = useRef<AIServiceManager | null>(null);

  // 初始化manager
  if (!managerRef.current) {
    managerRef.current = new AIServiceManager({
      onStream: () => {
        // 流式更新时刷新消息列表
        setMessages(managerRef.current?.getDisplayMessages() || []);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
      onComplete: () => {
        setIsLoading(false);
        setMessages(managerRef.current?.getDisplayMessages() || []);
      }
    });
  }

  const manager = managerRef.current;

  // 同步消息状态
  useEffect(() => {
    setMessages(manager.getDisplayMessages());
    setIsLoading(manager.isRequestLoading());
  }, []);

  const addUserMessage = (content: string, display: boolean = true): string => {
    const id = manager.addUserMessage(content, display);
    setMessages(manager.getDisplayMessages());
    return id;
  };

  const addSystemMessage = (content: string, display: boolean = false): string => {
    const id = manager.addSystemMessage(content, display);
    setMessages(manager.getDisplayMessages());
    return id;
  };

  const addAssistantMessage = (content: string, display: boolean = true): string => {
    const id = manager.addAssistantMessage(content, display);
    setMessages(manager.getDisplayMessages());
    return id;
  };

  const setMessageDisplay = (id: string, display: boolean): boolean => {
    const result = manager.setMessageDisplay(id, display);
    setMessages(manager.getDisplayMessages());
    return result;
  };

  const clearMessages = (): void => {
    manager.clearMessages();
    setMessages([]);
    setError(null);
  };

  const sendToAI = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      await manager.sendToAI();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const abort = (): void => {
    manager.abort();
    setIsLoading(false);
  };

  return {
    messages,
    addUserMessage,
    addSystemMessage,
    addAssistantMessage,
    setMessageDisplay,
    clearMessages,
    sendToAI,
    abort,
    isLoading,
    error
  };
}