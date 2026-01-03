import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiService } from '../../services/aiService';
import { Message } from '../../services/aiService';

export function Dialog({ messages, onSendMessage, isLoading, isWaitingForResponse, isDoubleSociety = false, isDeclared = true }: {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isWaitingForResponse: boolean;
  isDoubleSociety?: boolean;
  isDeclared?: boolean;
}) {
  const [input, setInput] = useState('');
  const [dotCount, setDotCount] = useState(1);
  const [normalPortraitIndex, setNormalPortraitIndex] = useState(1);
  const [specialPortraitIndex, setSpecialPortraitIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isPriestessMode, setIsPriestessMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const normalPortraits = [
    '/asset/立绘_远山_1.png',
    '/asset/立绘_远山_2.png',
    '/asset/立绘_远山_skin1.png'
  ];

  const specialPortraits = [
    '/asset/Priestess.png',
    '/asset/PriestessSmile.png'
  ];

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  const switchToNextPortrait = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setOpacity(0);
    
    setTimeout(() => {
      if (isPriestessMode) {
        setSpecialPortraitIndex((prev) => (prev + 1) % specialPortraits.length);
      } else {
        setNormalPortraitIndex((prev) => (prev + 1) % normalPortraits.length);
      }
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
          setSpecialPortraitIndex(0); // 切换到第一个特殊立绘
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
    let portraitPeriod = 90*1000; // 默认若干秒循环切换一次立绘
    const interval = setInterval(() => {
      switchToNextPortrait();
    }, portraitPeriod);
    return () => clearInterval(interval);
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

  // 自动调整 textarea 高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 重置高度为 auto 以获取正确的 scrollHeight
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    // 计算 最大rem 的像素值
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const maxHeight = rootFontSize * 6;
    // 设置高度为 scrollHeight，但不超过 maxHeight
    const newHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    // 如果内容超出最大高度，显示滚动条
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && isDeclared) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const getSpeakerName = (role: string) => {
    if (role === 'user') {
      let userName = localStorage.getItem('userName');
      if (!userName) {
        userName = '探索者';
        localStorage.setItem('userName', userName);
      }
      return userName;
    } else if (role === 'assistant') {
      if (isPriestessMode) {
        let name = '';
        let nameList = ['普瑞赛斯','Priestess','Error: System Mulfunction','这里万籁俱寂……■■，别留下我'];
        let r = Math.random();
        if (r < 0.7) {
          name = '远山';
        } else {
          name = nameList[Math.floor(Math.random() * nameList.length)];
        }
        return name;
      } else {
        return '远山';
      }
    }
    return '??';
  };

  const shouldShowPlaceholder = isWaitingForResponse;

  const messagesToRender = shouldShowPlaceholder && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].content === ''
    ? messages.slice(0, -1)
    : messages;

  return (
    <div className="relative flex flex-col md:flex-row h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center md:relative md:inset-auto md:w-[40vw] md:flex md:items-center md:justify-end">
        <img
          src={isPriestessMode ? specialPortraits[specialPortraitIndex] : normalPortraits[normalPortraitIndex]}
          alt="角色立绘"
          onClick={handlePortraitClick}
          className="object-contain cursor-pointer transition-opacity duration-1000 h-[40vh] md:h-[90%] brightness-[0.7] md:brightness-100"
          style={{ opacity }}
        />
      </div>

      {/* 一条消息框 */}
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-6 md:w-[50vw] md:bg-transparent h-full" style={{ background: 'linear-gradient(to bottom,transparent 0%,rgba(0, 0, 0, 0.25) 15%,rgba(0, 0, 0, 0.25) 85%,transparent 100%)' }}>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2" style={{ scrollbarWidth: 'none' }}>
          {messagesToRender.map((message, index) => (
            <div key={index} className="ice-glass-b3 py-2 px-3">
              <div className={`text-sammi-snow font-bold text-sm mb-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                {getSpeakerName(message.role)}
                {message.timestamp && (
                  <span className={`text-sammi-glow/70 font-light text-xs ml-2`}>
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>
              <div className={`text-sammi-glow leading-tight whitespace-normal font-serif-message text-sm prose prose-invert max-w-none ${message.role === 'user' ? 'text-right' : ''}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {/* 占位符消息框 */}
          {shouldShowPlaceholder && (
            <div className="ice-glass-b3 p-4">
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

        {/* 输入框 */}
        <form onSubmit={handleSubmit} className="flex-shrink-0 flex gap-2 mt-4 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && isDeclared) {
                e.preventDefault();
                handleSubmit(e as React.FormEvent);
              }
            }}
            placeholder={isDeclared ? "输入消息..." : "等待宣告密文板..."}
            disabled={isLoading || !isDeclared}
            rows={1}
            className="flex-1 ice-glass px-4 py-3 text-sammi-snow placeholder-sammi-glow/50 font-serif-message focus:outline-none disabled:opacity-50 resize-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !isDeclared}
            className="p-3 bg-sammi-deep hover:bg-sammi-deep/80 text-sammi-snow font-bold rounded-[0.5rem] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
}
