import React from 'react';
import { Foldartal } from '../../types/foldartal';

interface FoldartalCardProps {
  foldartal: Foldartal;
  selected: boolean;
  onClick: () => void;
}

export function FoldartalCard({ foldartal, selected, onClick }: FoldartalCardProps) {
  const imagePath = `/asset/foldartals/${foldartal.id}_${foldartal.name}.png`;

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 transform hover:scale-105
        ${selected ? 'ring-4 ring-sammi-glow scale-105' : 'ring-2 ring-sammi-glow/30'}
      `}
    >
      <div className="w-32 h-40 bg-sammi-soul/50 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={imagePath}
          alt={foldartal.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-sammi-deep/90 px-2 py-1 text-center">
        <span className="text-xs text-sammi-glow">{foldartal.name}</span>
      </div>
    </div>
  );
}
