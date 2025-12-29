import React from 'react';

export function DialogBox({ children, speaker = '远山' }: { children: React.ReactNode; speaker?: string }) {
  return (
    <div className="bg-sammi-blue/90 rounded-lg p-4 backdrop-blur-sm shadow-[0_0_20px_rgba(188,237,245,0.2)]">
      <div className="text-sammi-gold font-bold text-sm mb-2">{speaker}</div>
      <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}
