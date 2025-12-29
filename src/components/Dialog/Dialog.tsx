import React, { useState, useRef, useEffect } from 'react';
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

  const getSpeakerName = (role: string) => {
    return role === 'user' ? '探索者' : '远山';
  };

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      <div className="flex h-[600px]">
        <div className="w-[45%] flex items-center justify-center">
          <img
            src="/asset/立绘_远山_2.png"
            alt="角色立绘"
            className="h-[90%] object-contain"
          />
        </div>

        <div className="w-[75%] flex flex-col p-6">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
            {messages.map((message, index) => (
              <div key={index} className="p-4">
                <div className="text-sammi-glow font-bold text-sm mb-2">
                  {getSpeakerName(message.role)}
                </div>
                <div className="text-sammi-snow leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 h-16 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题..."
              disabled={isLoading}
              className="flex-1 rounded-lg px-4 py-3 text-sammi-snow placeholder-sammi-glow/50 focus:outline-none disabled:opacity-50"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={onAbort}
                className="px-6 py-3 bg-sammi-clan hover:bg-sammi-clan/80 text-white rounded-lg transition-colors"
              >
                终止
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-6 py-3 bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
