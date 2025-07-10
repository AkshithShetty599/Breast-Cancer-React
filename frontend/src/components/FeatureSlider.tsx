
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface FeatureSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export const FeatureSlider: React.FC<FeatureSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{min}</span>
        <span className="text-sm font-mono bg-blue-50 px-2 py-1 rounded text-blue-700">
          {value.toFixed(step < 1 ? 3 : 0)}
        </span>
        <span className="text-xs text-gray-500">{max}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};
