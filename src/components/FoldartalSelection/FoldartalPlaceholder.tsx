import React from 'react';
import { CardBack } from './FoldartalCard';

interface FoldartalPlaceholderProps {
  type: 'layout' | 'source';
  selected: boolean;
  onClick: () => void;
}

export function FoldartalPlaceholder({ type, selected, onClick }: FoldartalPlaceholderProps) {
  return (
    <CardBack
      type={type}
      selected={selected}
      onClick={onClick}
    />
  );
}
