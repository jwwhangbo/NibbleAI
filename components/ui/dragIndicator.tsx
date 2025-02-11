import React from 'react';
import { type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';
import invariant from 'tiny-invariant';
import { validateCssUnitValue } from '@/lib/utils';

interface DragIndicatorProps {
  edge: Edge;
  gap: string; // e.g., "1px", "2rem"
}

export default function DragIndicator({ edge, gap }: DragIndicatorProps) {
  const parseGap = (gap: string) => {
    const value = parseFloat(gap);
    const unit = gap.replace(value.toString(), '');
    return { value, unit };
  };

  const { value, unit } = parseGap(gap);
  
  invariant(!validateCssUnitValue(unit));

  const offsetStyles = {
    [edge]: `${value}${unit}`,
  };

  return (
    <div className="absolute flex w-full items-center" style={offsetStyles}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={4}
        stroke="#2b7fff"
        className="size-2"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
      <div className="w-full h-[2px] bg-[#2b7fff]" />
    </div>
  );
}
