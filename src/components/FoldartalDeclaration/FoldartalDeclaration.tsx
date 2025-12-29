import React from 'react';
import { Foldartal } from '../../types/foldartal';

export function FoldartalDisplay({ foldartal, position }: {
  foldartal: Foldartal;
  position: 'layout' | 'source';
}) {
  const imagePath = `/asset/foldartals/${foldartal.id}_${foldartal.name}.png`;
  const positionText = position === 'layout' ? '布局' : '本因';

  return (
    <div className="bg-sammi-blue/50 border border-sammi-gold/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <img
            src={imagePath}
            alt={foldartal.name}
            className="w-32 h-40 object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-sammi-gold/70 bg-sammi-gold/20 px-2 py-1 rounded">
              {positionText}
            </span>
            <span className="text-xs text-gray-400 bg-sammi-dark/50 px-2 py-1 rounded">
              {foldartal.type}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-sammi-gold">{foldartal.name}</h3>
          <p className="text-sm text-gray-400 font-mono">{foldartal.nameEn}</p>
          <p className="text-sm text-gray-500">{foldartal.nameRune}</p>

          <div className="border-t border-sammi-gold/20 pt-3">
            <p className="text-sm text-gray-300 mb-2">
              <span className="text-sammi-gold">主神：</span>
              {foldartal.god} ({foldartal.godEn})
            </p>
            <p className="text-sm text-gray-400 italic leading-relaxed">
              {foldartal.motto}
            </p>
          </div>

          {foldartal.chant && (
            <div className="bg-sammi-dark/50 rounded p-3 mt-3">
              <p className="text-sm text-gray-300 text-center">
                {foldartal.chant}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FoldartalDeclaration({ layout, source, concord, onContinue }: {
  layout: Foldartal;
  source: Foldartal;
  concord: string;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-sammi-gold mb-2">密文板宣告</h1>
        <p className="text-gray-400">命运的启示已显现</p>
      </div>

      <div className="flex flex-col gap-6">
        <FoldartalDisplay foldartal={layout} position="layout" />
        <div className="text-center text-sammi-gold text-2xl">↓</div>
        <FoldartalDisplay foldartal={source} position="source" />
      </div>

      {concord && (
        <div className="bg-gradient-to-r from-sammi-gold/20 to-sammi-gold/10 border-2 border-sammi-gold/50 rounded-lg p-6 text-center">
          <p className="text-sm text-sammi-gold/70 mb-2">协语</p>
          <p className="text-2xl font-bold text-sammi-gold">{concord}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-sammi-gold hover:bg-yellow-600 text-sammi-dark font-bold text-lg rounded-lg transition-colors"
        >
          继续对话
        </button>
      </div>
    </div>
  );
}
