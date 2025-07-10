
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { FeatureData } from '@/types/FeatureData';

interface RadarVisualizationProps {
  features: FeatureData;
}

export const RadarVisualization: React.FC<RadarVisualizationProps> = ({ features }) => {
  // Normalize values for better visualization
  const normalizeValue = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const radarData = [
    {
      subject: 'Radius',
      Mean: normalizeValue(features.radius_mean, 5, 30),
      SE: normalizeValue(features.radius_se * 10, 1, 30), // Scale up SE for visibility
      Worst: normalizeValue(features.radius_worst, 7, 40),
      fullMark: 100
    },
    {
      subject: 'Texture',
      Mean: normalizeValue(features.texture_mean, 5, 40),
      SE: normalizeValue(features.texture_se * 5, 1.5, 25), // Scale up SE for visibility
      Worst: normalizeValue(features.texture_worst, 10, 50),
      fullMark: 100
    },
    {
      subject: 'Perimeter',
      Mean: normalizeValue(features.perimeter_mean, 40, 200),
      SE: normalizeValue(features.perimeter_se * 4, 2, 100), // Scale up SE for visibility
      Worst: normalizeValue(features.perimeter_worst, 50, 250),
      fullMark: 100
    },
    {
      subject: 'Area',
      Mean: normalizeValue(features.area_mean, 100, 2500),
      SE: normalizeValue(features.area_se / 2, 2.5, 275), // Scale down SE for visibility
      Worst: normalizeValue(features.area_worst, 150, 4000),
      fullMark: 100
    },
    {
      subject: 'Smoothness',
      Mean: normalizeValue(features.smoothness_mean, 0.05, 0.25),
      SE: normalizeValue(features.smoothness_se * 1000, 1, 35), // Scale up SE for visibility
      Worst: normalizeValue(features.smoothness_worst, 0.07, 0.22),
      fullMark: 100
    },
    {
      subject: 'Compactness',
      Mean: normalizeValue(features.compactness_mean, 0.01, 0.35),
      SE: normalizeValue(features.compactness_se * 100, 0.2, 14), // Scale up SE for visibility
      Worst: normalizeValue(features.compactness_worst, 0.03, 1.1),
      fullMark: 100
    }
  ];

  return (
    <Card className="w-full bg-white shadow-lg border-purple-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
          <span>📈 Feature Visualization</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Radar chart showing normalized feature values
        </p>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={0} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
            />
            <Radar
              name="Mean Values"
              dataKey="Mean"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="SE Values"
              dataKey="SE"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Worst Values"
              dataKey="Worst"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
