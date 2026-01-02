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
        relative cursor-pointer transition-all duration-500 h-full w-auto flex-none flex items-center justify-center min-h-[120px]
        ${selected ? '-translate-y-2' : 'hover:-translate-y-1'}
      `}
    >
      <div
      className={`
        h-full w-auto aspect-[5/8] rounded-xl overflow-hidden relative
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
        
        <div className="absolute inset-0 z-10">
          <div className="absolute top-[11%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className={`
              text-[clamp(16px,2.5vw,20px)] font-bold transition-all duration-500
              ${selected ? 'text-sammi-glow' : 'text-sammi-ice/50'}
            `}>
              {typeText}
            </div>
          </div>
          <div className="absolute top-[77%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className={`
              text-[clamp(12px,1.5vw,14px)] transition-all duration-500 mt-2
              ${selected ? 'text-sammi-glow/80' : 'text-sammi-ice/30'}
            `}>
              {selected ? '已选择' : '点击选择'}
            </div>

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

  const cardContent = (
    <div className="relative w-full h-full max-h-[320px] aspect-[208/320] rounded-xl overflow-hidden">
      <img
        src="/asset/卡片背景504x792.jpg"
        alt="卡片背景"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 z-10">
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-[clamp(10px,3vw,24px)] font-medium text-sammi-snow">
            {foldartal.nameRune.replace(/[\[\]]/g, '')}
          </p>
        </div>
        <div className="absolute top-[16.5%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-[clamp(4px,1vw,10px)] font-thin tracking-widest text-sammi-snow/50 font-mono">
            {foldartal.god}
          </p>
        </div>
        
        <div className="absolute top-[42%] left-[49.7%] -translate-x-1/2 -translate-y-1/2">
          <img
            src={imagePath}
            alt={foldartal.name}
            className="w-[clamp(60px,12vw,96px)] h-[clamp(60px,12vw,96px)] object-contain"
          />
        </div>
        
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 text-center font-light space-y-0.5">
          <p className="text-[clamp(13px,2vw,18px)] text-sammi-snow bg-gray-900/60 px-1 rounded-md shadow-lg">
            {foldartal.name}
          </p>
        </div>
        <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 text-center space-y-0.5">
          <p className="text-[clamp(4px,1.5vw,14px)] text-sammi-snow/50 font-mono">
            {foldartal.nameEn}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    // 高度用clamp
    <div className={`flex flex-col items-center space-y-2 h-[clamp(160px,20vh,200px)] mb-6 min-w-[85px] justify-center ${animate ? 'animate-reveal' : ''}`}>
      {cardContent}
      <div className="absolute md:-bottom-6 -bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[clamp(8px,1.5vw,14px)] text-sammi-snow/60">
          {foldartal.category}·{foldartal.type}
        </p>
      </div>
    </div>
  );
}
