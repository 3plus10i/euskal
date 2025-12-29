import React, { useState } from 'react';
import { Foldartal } from '../../types/foldartal';
import { foldartals } from '../../data/foldartals';
import { FoldartalPlaceholder } from './FoldartalPlaceholder';

interface FoldartalSelectionProps {
  onConfirm: (layout: number, source: number) => void;
  userName: string;
}

export function FoldartalSelection({ onConfirm, userName }: FoldartalSelectionProps) {
  const [selectedLayout, setSelectedLayout] = useState<Foldartal | null>(null);
  const [selectedSource, setSelectedSource] = useState<Foldartal | null>(null);

  const layoutFoldartals = foldartals.filter(f => f.category === '布局');
  const sourceFoldartals = foldartals.filter(f => f.category === '本因');

  const handleLayoutClick = () => {
    const randomIndex = Math.floor(Math.random() * layoutFoldartals.length);
    setSelectedLayout(layoutFoldartals[randomIndex]);
  };

  const handleSourceClick = () => {
    const randomIndex = Math.floor(Math.random() * sourceFoldartals.length);
    setSelectedSource(sourceFoldartals[randomIndex]);
  };

  const handleConfirm = () => {
    if (selectedLayout && selectedSource) {
      onConfirm(selectedLayout.id, selectedSource.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-16">
      <div className="text-center space-y-4">
        <p className="text-2xl text-sammi-ice/80">探索者{userName}</p>
        <h1 className="text-5xl font-bold text-sammi-glow tracking-wide">请选择密文板</h1>
        <p className="text-sammi-ice/60 text-lg">选择布局与本因，揭示命运的启示</p>
      </div>

      <div className="flex justify-center items-start gap-24">
        <FoldartalPlaceholder
          type="layout"
          selected={selectedLayout !== null}
          onClick={handleLayoutClick}
        />
        
        <FoldartalPlaceholder
          type="source"
          selected={selectedSource !== null}
          onClick={handleSourceClick}
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selectedLayout || !selectedSource}
        className={`
          px-12 py-5 text-xl font-bold rounded-full transition-all duration-500
          ${!selectedLayout || !selectedSource
            ? 'bg-sammi-soul/20 text-sammi-ice/30 cursor-not-allowed'
            : 'bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice'
          }
        `}
      >
        开始宣读
      </button>
    </div>
  );
}
