import React, { useState, useRef, useEffect } from 'react';
import { DialogBox } from './DialogBox';
import { CharacterPortrait } from './CharacterPortrait';
import { aiService } from '../../services/aiService';
import { Message } from '../../services/aiService';

export function Dialog({ messages, onSendMessage, isLoading, onAbort }: {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onAbort: () => void;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-sammi-dark/50 rounded-lg min-h-[500px]">
      <div className="flex-shrink-0">
        <CharacterPortrait variant={1} />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col gap-2">
              {message.role === 'user' && (
                <div className="self-end bg-sammi-light/30 border border-sammi-light/50 rounded-lg p-4 max-w-[80%]">
                  <div className="text-gray-200 whitespace-pre-wrap">{message.content}</div>
                </div>
              )}
              {message.role === 'assistant' && (
                <DialogBox>{message.content}</DialogBox>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            disabled={isLoading}
            className="flex-1 bg-sammi-blue/50 border border-sammi-gold/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sammi-gold disabled:opacity-50"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={onAbort}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              终止
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-sammi-gold hover:bg-yellow-600 text-sammi-dark font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
