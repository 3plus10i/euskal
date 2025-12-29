import React from 'react';

export function DialogBox({ children, speaker = '远山' }: { children: React.ReactNode; speaker?: string }) {
  return (
    <div className="relative bg-sammi-blue/90 border-2 border-sammi-gold/50 rounded-lg p-6 backdrop-blur-sm shadow-2xl">
      <div className="absolute -top-3 left-6 bg-sammi-dark px-4 py-1 border border-sammi-gold/50 rounded">
        <span className="text-sammi-gold font-bold text-sm">{speaker}</span>
      </div>
      <div className="mt-2 text-gray-100 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-sammi-gold/50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-sammi-gold/50"></div>
    </div>
  );
}
