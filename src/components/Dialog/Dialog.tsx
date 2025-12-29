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

  const getSpeakerName = (role: string) => {
    return role === 'user' ? '探索者' : '远山';
  };

  return (
    <div className="relative bg-sammi-dark/50 rounded-lg min-h-[600px] overflow-hidden">
      <div className="flex flex-col h-[600px]">
        <div className="flex-1 relative">
          <div className="absolute left-[-5%] top-0 h-full flex items-center">
            <img
              src="/asset/立绘_远山_2.png"
              alt="角色立绘"
              style={{ width: 'auto', height: '90%' }}
              className="object-contain drop-shadow-2xl"
            />
          </div>

          <div className="absolute left-[20%] top-0 w-[80%] h-full flex flex-col p-6 pr-6">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
              {messages.map((message, index) => (
                <div key={index} className="bg-sammi-blue/40 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sammi-gold font-bold text-sm mb-2">
                    {getSpeakerName(message.role)}
                  </div>
                  <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 h-16 p-6 pt-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            disabled={isLoading}
            className="flex-1 bg-sammi-blue/50 border-2 border-sammi-gold/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sammi-gold disabled:opacity-50"
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
