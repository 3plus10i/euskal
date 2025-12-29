import React from 'react';

interface FoldartalPlaceholderProps {
  type: 'layout' | 'source';
  selected: boolean;
  onClick: () => void;
}

export function FoldartalPlaceholder({ type, selected, onClick }: FoldartalPlaceholderProps) {
  const typeText = type === 'layout' ? '布局' : '本因';
  const placeholderImage = type === 'layout' ? '/asset/布局占位符1x1.png' : '/asset/本因占位符1x1.png';

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-500
        ${selected ? '-translate-y-4' : 'hover:-translate-y-2'}
      `}
    >
      <div
        className={`
          w-40 h-64 rounded-xl overflow-hidden relative
          transition-all duration-500
          ${selected ? 'shadow-[0_0_20px_rgba(176,206,245,0.3)]' : ''}
        `}
      >
        <img
          src="/asset/卡片背景504x792.jpg"
          alt="卡片背景"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div
          className={`
            absolute inset-0 transition-all duration-700
            ${selected ? 'bg-black/0' : 'bg-black/70'}
          `}
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img
            src={placeholderImage}
            alt={typeText}
            className={`
              w-20 h-20 transition-all duration-500
              ${selected ? 'opacity-100 scale-110' : 'opacity-60 scale-100'}
            `}
          />
          <div className={`
            text-xl font-bold transition-all duration-500 mt-4
            ${selected ? 'text-sammi-glow' : 'text-sammi-ice/50'}
          `}>
            {typeText}
          </div>
          <div className={`
            text-sm transition-all duration-500 mt-2
            ${selected ? 'text-sammi-glow/80' : 'text-sammi-ice/30'}
          `}>
            {selected ? '已选择' : '点击选择'}
          </div>
        </div>
      </div>
    </div>
  );
}
