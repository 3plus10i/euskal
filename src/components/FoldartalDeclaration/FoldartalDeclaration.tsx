import React from 'react';
import { Foldartal } from '../../types/foldartal';

interface FoldartalDisplayProps {
  foldartal: Foldartal;
  position: 'layout' | 'source';
}

function FoldartalDisplay({ foldartal, position }: FoldartalDisplayProps) {
  const imagePath = `/asset/foldartals/${foldartal.id}_${foldartal.name}.png`;
  const positionText = position === 'layout' ? '布局' : '本因';

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-64 h-64 flex items-center justify-center overflow-hidden">
        <img
          src={imagePath}
          alt={foldartal.name}
          className="w-full h-full object-contain]"
        />
      </div>
      
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-sammi-glow/80 px-3 py-1 rounded-full">
            {positionText}
          </span>
          <span className="text-sm text-sammi-ice/60 px-3 py-1 rounded-full">
            {foldartal.type}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-sammi-glow">{foldartal.name}</h3>
        <p className="text-sm text-sammi-ice/50 font-mono">{foldartal.nameEn}</p>
        <p className="text-sm text-sammi-ice/30">{foldartal.nameRune}</p>
      </div>

      {foldartal.chant && (
        <div className="text-center max-w-xs">
          <p className="text-sm text-sammi-ice/70 leading-relaxed">
            {foldartal.chant}
          </p>
        </div>
      )}

      <div className="text-center space-y-1 max-w-xs">
        <p className="text-base text-sammi-ice">
          <span className="text-sammi-glow">主神：</span>
          {foldartal.god}
        </p>
        <p className="text-sm text-sammi-ice/60 italic leading-relaxed">
          {foldartal.motto}
        </p>
      </div>
    </div>
  );
}

interface FoldartalDeclarationProps {
  layout: Foldartal;
  source: Foldartal;
  concord: string;
  onContinue: () => void;
}

export function FoldartalDeclaration({ layout, source, concord, onContinue }: FoldartalDeclarationProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-sammi-glow tracking-wide">密文板宣告</h1>
        <p className="text-sammi-ice/60 text-lg">命运的启示已显现</p>
      </div>

      <div className="flex justify-center items-start gap-32">
        <FoldartalDisplay foldartal={layout} position="layout" />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2 bg-gradient-to-r from-sammi-glow/20 to-sammi-glow/10 rounded-lg p-6">
            <p className="text-sm text-sammi-glow/70">协语</p>
            <p className="text-3xl font-bold text-sammi-glow">{concord}</p>
          </div>
          
          <div className="text-center space-y-1 bg-sammi-deep/20 rounded-lg p-4">
            <p className="text-sm text-sammi-glow/70">修辞</p>
            <p className="text-xl text-sammi-ice">{layout.type} · {source.type}</p>
          </div>
        </div>

        <FoldartalDisplay foldartal={source} position="source" />
      </div>

      <button
        onClick={onContinue}
        className="px-12 py-5 text-xl font-bold rounded-full bg-sammi-yuan-red hover:bg-sammi-yuan-red/80 text-sammi-ice shadow-[0_0_40px_rgba(144,45,70,0.5)] hover:shadow-[0_0_60px_rgba(144,45,70,0.7)] transition-all duration-500"
      >
        继续对话
      </button>
    </div>
  );
}
