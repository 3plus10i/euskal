import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiService } from '../../services/aiService';
import { Message } from '../../services/aiService';

export function Dialog({ messages, onSendMessage, isLoading, isWaitingForResponse, isDoubleSociety = false }: {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isWaitingForResponse: boolean;
  isDoubleSociety?: boolean;
}) {
  const [input, setInput] = useState('');
  const [dotCount, setDotCount] = useState(1);
  const [portraitIndex, setPortraitIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isPriestessMode, setIsPriestessMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const portraits = [
    '/asset/立绘_远山_1.png',
    '/asset/立绘_远山_2.png',
    '/asset/立绘_远山_skin1.png',
    '/asset/Priestess.png'
  ];

  const switchToNextPortrait = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setOpacity(0);
    
    setTimeout(() => {
      setPortraitIndex((prev) => (prev + 1) % (portraits.length-1)); // 正常情况永远跳过最后一个
      setOpacity(1);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }, 1000);
  };

  const handlePortraitClick = () => {
    if (isPriestessMode) return;
    switchToNextPortrait();
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDotCount(prev => (prev % 3) + 1);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDotCount(1);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isDoubleSociety && !isPriestessMode) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setOpacity(0);
        
        setTimeout(() => {
          setPortraitIndex(3);
          setIsPriestessMode(true);
          setOpacity(1);
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        }, 1000);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isDoubleSociety, isPriestessMode]);

  useEffect(() => {
    if (!isPriestessMode) {
      const interval = setInterval(() => {
        switchToNextPortrait();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isPriestessMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
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

  const shouldShowPlaceholder = isWaitingForResponse;

  const messagesToRender = shouldShowPlaceholder && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].content === ''
    ? messages.slice(0, -1)
    : messages;

  return (
    <div className="relative flex flex-col md:flex-row h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center md:relative md:inset-auto md:w-[40vw] md:flex md:items-center md:justify-end">
        <img
          src={portraits[portraitIndex]}
          alt="角色立绘"
          onClick={handlePortraitClick}
          className="object-contain cursor-pointer transition-opacity duration-1000 h-[40vh] md:h-[90%]"
          style={{ opacity }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-6 md:w-[50vw] md:bg-transparent h-full" style={{ background: 'linear-gradient(to bottom,transparent 0%,rgba(0, 0, 0, 0.25) 15%,rgba(0, 0, 0, 0.25) 85%,transparent 100%)' }}>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2" style={{ scrollbarWidth: 'none' }}>
          {messagesToRender.map((message, index) => (
            <div key={index} className="ice-glass-b1 p-4">
              <div className="text-sammi-snow font-bold text-sm mb-2">
                {getSpeakerName(message.role)}
              </div>
              <div className="text-sammi-glow leading-relaxed whitespace-normal font-serif-message text-sm prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {shouldShowPlaceholder && (
            <div className="ice-glass-b1 p-4">
              <div className="text-sammi-snow font-bold text-sm mb-2">
                远山
              </div>
              <div className="text-sammi-glow leading-relaxed whitespace-normal font-serif-message">
                <div className="flex items-center gap-2">
                  <span >嗯{'.'.repeat(dotCount)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex-shrink-0 flex gap-2 md:h-16 h-12 mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            disabled={isLoading}
            className="flex-1 ice-glass px-4 py-3 text-sammi-snow placeholder-sammi-glow/50 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-sammi-deep hover:bg-sammi-deep/80 text-sammi-snow font-bold rounded-[20%] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
}
