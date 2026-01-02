import React from 'react';
import { Foldartal } from '../../types/foldartal';
import { CardBack } from './FoldartalCard';

interface PreDeclarationViewProps {
  selectedLayout: Foldartal | null;
  selectedSource: Foldartal | null;
  handleLayoutClick: () => void;
  handleSourceClick: () => void;
  handleDeclare: () => void;
}

export function PreDeclarationView({
  selectedLayout,
  selectedSource,
  handleLayoutClick,
  handleSourceClick,
  handleDeclare
}: PreDeclarationViewProps) {
  return (
    <>
      {/* 移动端布局：md 以下显示 */}
      <div className="flex flex-col items-center justify-between h-full min-h-[180px] md:hidden">
        <div className="flex flex-row justify-center w-full items-center gap-4" style={{ height: '210px' }}>
          <CardBack
            type="layout"
            selected={selectedLayout !== null}
            onClick={handleLayoutClick}
          />
          <CardBack
            type="source"
            selected={selectedSource !== null}
            onClick={handleSourceClick}
          />
        </div>
        <div
          onClick={handleDeclare}
          className={`
            relative w-[20vw] aspect-[4/3] cursor-pointer transition-all duration-500 mb-4
            ${!selectedLayout || !selectedSource
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-100 hover:-translate-y-2 hover:brightness-110'
            }
          `}
        >
          <img
            src="/asset/资料背景素材小图腾圆形1x1.png"
            alt="开始宣告"
            className="w-full h-full object-contain"
          />
          <span className="absolute inset-0 flex items-center justify-center text-sammi-ice font-normal text-[clamp(16px,2vw,32px)]">
            开始宣告
          </span>
        </div>
      </div>

      {/* 桌面端布局：md 以上显示 */}
      <div className="hidden md:flex justify-center items-center gap-8 h-full min-h-[230px] w-full">
        <CardBack
          type="layout"
          selected={selectedLayout !== null}
          onClick={handleLayoutClick}
        />

        <div
          onClick={handleDeclare}
          className={`
            relative w-full max-w-[256px] aspect-[4/3] cursor-pointer transition-all duration-500
            ${!selectedLayout || !selectedSource
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-100 hover:-translate-y-2 hover:brightness-110'
            }
          `}
        >
          <img
            src="/asset/资料背景素材小图腾圆形1x1.png"
            alt="开始宣告"
            className="w-full h-full object-contain"
          />
          <span className="absolute inset-0 flex items-center justify-center text-sammi-ice font-normal text-[clamp(12px,2vw,32px)]">
            开始宣告
          </span>
        </div>

        <CardBack
          type="source"
          selected={selectedSource !== null}
          onClick={handleSourceClick}
        />
      </div>
    </>
  );
}