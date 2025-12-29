import React from 'react';

export function CharacterPortrait({ variant = 1 }: { variant?: 1 | 2 | 3 }) {
  const getImagePath = () => {
    switch (variant) {
      case 1:
        return '/asset/立绘_远山_1.png';
      case 2:
        return '/asset/立绘_远山_2.png';
      case 3:
        return '/asset/立绘_远山_skin1.png';
      default:
        return '/asset/立绘_远山_1.png';
    }
  };

  return (
    <div className="relative w-64 h-96 flex-shrink-0">
      <img
        src={getImagePath()}
        alt="远山"
        className="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
  );
}
