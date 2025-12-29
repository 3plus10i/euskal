import React, { useState } from 'react';
import { Foldartal } from '../../types/foldartal';
import { foldartals } from '../../data/foldartals';

export function FoldartalCard({ foldartal, selected, onClick }: {
  foldartal: Foldartal;
  selected: boolean;
  onClick: () => void;
}) {
  const imagePath = `/asset/foldartals/${foldartal.id}_${foldartal.name}.png`;

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 transform hover:scale-105
        ${selected ? 'ring-4 ring-sammi-gold scale-105' : 'ring-2 ring-sammi-gold/30'}
      `}
    >
      <div className="w-32 h-40 bg-sammi-blue/50 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={imagePath}
          alt={foldartal.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-sammi-dark/90 px-2 py-1 text-center">
        <span className="text-xs text-sammi-gold">{foldartal.name}</span>
      </div>
    </div>
  );
}

export function FoldartalSelection({ onConfirm }: { onConfirm: (layout: number, source: number) => void }) {
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);

  const layoutFoldartals = foldartals.filter(f => f.category === '布局');
  const sourceFoldartals = foldartals.filter(f => f.category === '本因');

  const handleLayoutClick = (id: number) => {
    setSelectedLayout(id);
  };

  const handleSourceClick = (id: number) => {
    setSelectedSource(id);
  };

  const handleConfirm = () => {
    if (selectedLayout !== null && selectedSource !== null) {
      onConfirm(selectedLayout, selectedSource);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-sammi-gold mb-4 text-center">选择布局密文板</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {layoutFoldartals.map(foldartal => (
            <FoldartalCard
              key={foldartal.id}
              foldartal={foldartal}
              selected={selectedLayout === foldartal.id}
              onClick={() => handleLayoutClick(foldartal.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-sammi-gold mb-4 text-center">选择本因密文板</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {sourceFoldartals.map(foldartal => (
            <FoldartalCard
              key={foldartal.id}
              foldartal={foldartal}
              selected={selectedSource === foldartal.id}
              onClick={() => handleSourceClick(foldartal.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={selectedLayout === null || selectedSource === null}
          className="px-8 py-4 bg-sammi-gold hover:bg-yellow-600 text-sammi-dark font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          开始宣告
        </button>
      </div>
    </div>
  );
}
