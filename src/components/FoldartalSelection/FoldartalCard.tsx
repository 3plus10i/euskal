import React from 'react';
import { Foldartal } from '../../types/foldartal';

interface CardBackProps {
  type: 'layout' | 'source';
  selected: boolean;
  onClick: () => void;
}

export function CardBack({ type, selected, onClick }: CardBackProps) {
  const typeText = type === 'layout' ? '布局' : '本因';

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
          <div className={`
            text-xl font-bold transition-all duration-500
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

interface CardFrontProps {
  foldartal: Foldartal;
  position: 'layout' | 'source';
  animate?: boolean;
}

export function CardFront({ foldartal, position, animate = false }: CardFrontProps) {
  const imagePath = `/asset/foldartals/${foldartal.id}_${foldartal.name}.png`;

  return (
    <div className={`flex flex-col items-center space-y-2 ${animate ? 'animate-reveal' : ''}`}>
      <div className="relative w-52 h-80 rounded-xl overflow-hidden">
        <img
          src="/asset/卡片背景504x792.jpg"
          alt="卡片背景"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* 使用绝对定位容器 */}
        <div className="absolute inset-0 z-10">
          {/* 顶部符文文字 - 调整top百分比来匹配设计 */}
          <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center">
            {/* 使用text-2xl和font-medium（500） */}
            <p className="text-2xl font-medium text-sammi-snow">
              {foldartal.nameRune.replace(/[\[\]]/g, '')}
            </p>
          </div>
          <div className="absolute top-[16.5%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-[10px] font-thin tracking-widest text-sammi-snow/50 font-mono">
              {foldartal.god}
            </p>
          </div>
          
          {/* 中间图标 - 精确居中 */}
          <div className="absolute top-[42%] left-[49.7%] -translate-x-1/2 -translate-y-1/2">
            <img
              src={imagePath}
              alt={foldartal.name}
              className="w-24 h-24 object-contain"
            />
          </div>
          
          {/* 底部文字 - 调整bottom百分比 */}
          <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 text-center space-y-0.5">
            <p className="text-base text-sammi-snow">
              {/* {foldartal.type} - {foldartal.name} */}
              {foldartal.name}
            </p>
          </div>
          <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 text-center space-y-0.5">
            <p className="text-sm text-sammi-snow/50 font-mono">
              {foldartal.nameEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
