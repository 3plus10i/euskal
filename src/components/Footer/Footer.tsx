import React from 'react';

export function Footer({ onAboutClick, onSettingsClick, onVersionClick }: {
  onAboutClick: () => void;
  onSettingsClick: () => void;
  onVersionClick: () => void;
}) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 ice-glass rounded-none"> 
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex gap-4 md:gap-6">
          <button
            onClick={onAboutClick}
            className="text-sm md:text-base text-sammi-ice/80 hover:text-sammi-glow transition-colors cursor-pointer"
          >
            关于
          </button>
          <button
            onClick={onSettingsClick}
            className="text-sm md:text-base text-sammi-ice/80 hover:text-sammi-glow transition-colors cursor-pointer"
          >
            设置
          </button>
        </div>
        <button
          onClick={onVersionClick}
          className="text-sm md:text-base text-sammi-ice/60 hover:text-sammi-glow transition-colors cursor-pointer"
        >
          v1.3
        </button>
      </div>
    </footer>
  );
}
