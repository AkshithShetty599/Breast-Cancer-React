import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureSlider } from '@/components/FeatureSlider';
import { FeatureData, FeatureConfig } from '@/types/FeatureData';
import axios from 'axios';

interface InputFormProps {
  features: FeatureData;
  updateFeature: (key: keyof FeatureData, value: number) => void;
  onPredict: () => void;
  isLoading: boolean;
}

type FeatureStats = {
  [key in keyof FeatureData]: {
    min: number;
    max: number;
    mean: number;
  };
};

const featureGroups: { title: string; features: FeatureConfig[] }[] = [
  {
    title: "Mean Values",
    features: [
      {
        key: 'radius_mean', label: 'Radius Mean', step: 0.1, description: 'Mean distance from center to perimeter points',
        min: 0,
        max: 0
      },
      {
        key: 'texture_mean', label: 'Texture Mean', step: 0.1, description: 'Standard deviation of gray-scale values',
        min: 0,
        max: 0
      },
      {
        key: 'perimeter_mean', label: 'Perimeter Mean', step: 1, description: 'Mean perimeter of the cell nucleus',
        min: 0,
        max: 0
      },
      {
        key: 'area_mean', label: 'Area Mean', step: 10, description: 'Mean area of the cell nucleus',
        min: 0,
        max: 0
      },
      {
        key: 'smoothness_mean', label: 'Smoothness Mean', step: 0.001, description: 'Mean local variation in radius lengths',
        min: 0,
        max: 0
      },
      {
        key: 'compactness_mean', label: 'Compactness Mean', step: 0.001, description: 'Mean perimeter² / area - 1.0',
        min: 0,
        max: 0
      },
      {
        key: 'concavity_mean', label: 'Concavity Mean', step: 0.001, description: 'Mean severity of concave portions',
        min: 0,
        max: 0
      },
      {
        key: 'concave_points_mean', label: 'Concave Points Mean', step: 0.001, description: 'Mean number of concave portions',
        min: 0,
        max: 0
      },
      {
        key: 'symmetry_mean', label: 'Symmetry Mean', step: 0.001, description: 'Mean symmetry of the cell nucleus',
        min: 0,
        max: 0
      },
      {
        key: 'fractal_dimension_mean', label: 'Fractal Dimension Mean', step: 0.001, description: 'Mean "coastline approximation" - 1',
        min: 0,
        max: 0
      }
    ]
  },
  {
    title: "Standard Error Values",
    features: [
      {
        key: 'radius_se', label: 'Radius SE', step: 0.01, description: 'Standard error of radius measurements',
        min: 0,
        max: 0
      },
      {
        key: 'texture_se', label: 'Texture SE', step: 0.01, description: 'Standard error of texture measurements',
        min: 0,
        max: 0
      },
      {
        key: 'perimeter_se', label: 'Perimeter SE', step: 0.1, description: 'Standard error of perimeter measurements',
        min: 0,
        max: 0
      },
      {
        key: 'area_se', label: 'Area SE', step: 1, description: 'Standard error of area measurements',
        min: 0,
        max: 0
      },
      {
        key: 'smoothness_se', label: 'Smoothness SE', step: 0.0001, description: 'Standard error of smoothness measurements',
        min: 0,
        max: 0
      },
      {
        key: 'compactness_se', label: 'Compactness SE', step: 0.001, description: 'Standard error of compactness measurements',
        min: 0,
        max: 0
      },
      {
        key: 'concavity_se', label: 'Concavity SE', step: 0.001, description: 'Standard error of concavity measurements',
        min: 0,
        max: 0
      },
      {
        key: 'concave_points_se', label: 'Concave Points SE', step: 0.0001, description: 'Standard error of concave points measurements',
        min: 0,
        max: 0
      },
      {
        key: 'symmetry_se', label: 'Symmetry SE', step: 0.0001, description: 'Standard error of symmetry measurements',
        min: 0,
        max: 0
      },
      {
        key: 'fractal_dimension_se', label: 'Fractal Dimension SE', step: 0.0001, description: 'Standard error of fractal dimension measurements',
        min: 0,
        max: 0
      }
    ]
  },
  {
    title: "Worst Values",
    features: [
      {
        key: 'radius_worst', label: 'Radius Worst', step: 0.1, description: 'Worst (largest) radius measurement',
        min: 0,
        max: 0
      },
      {
        key: 'texture_worst', label: 'Texture Worst', step: 0.1, description: 'Worst (largest) texture measurement',
        min: 0,
        max: 0
      },
      {
        key: 'perimeter_worst', label: 'Perimeter Worst', step: 1, description: 'Worst (largest) perimeter measurement',
        min: 0,
        max: 0
      },
      {
        key: 'area_worst', label: 'Area Worst', step: 10, description: 'Worst (largest) area measurement',
        min: 0,
        max: 0
      },
      {
        key: 'smoothness_worst', label: 'Smoothness Worst', step: 0.001, description: 'Worst (largest) smoothness measurement',
        min: 0,
        max: 0
      },
      {
        key: 'compactness_worst', label: 'Compactness Worst', step: 0.001, description: 'Worst (largest) compactness measurement',
        min: 0,
        max: 0
      },
      {
        key: 'concavity_worst', label: 'Concavity Worst', step: 0.001, description: 'Worst (largest) concavity measurement',
        min: 0,
        max: 0
      },
      {
        key: 'concave_points_worst', label: 'Concave Points Worst', step: 0.001, description: 'Worst (largest) concave points measurement',
        min: 0,
        max: 0
      },
      {
        key: 'symmetry_worst', label: 'Symmetry Worst', step: 0.001, description: 'Worst (largest) symmetry measurement',
        min: 0,
        max: 0
      },
      {
        key: 'fractal_dimension_worst', label: 'Fractal Dimension Worst', step: 0.001, description: 'Worst (largest) fractal dimension measurement',
        min: 0,
        max: 0
      }
    ]
  }
];

export const InputForm: React.FC<InputFormProps> = ({
  features,
  updateFeature,
  onPredict,
  isLoading
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    "Mean Values": true,
    "Standard Error Values": false,
    "Worst Values": false
  });

  const [featureStats, setFeatureStats] = useState<FeatureStats | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/feature-stats')  // Replace with actual deployed URL
      .then((res) => setFeatureStats(res.data))
      .catch((err) => {
        console.error('Error fetching feature stats', err);
      });
  }, []);

  if (!featureStats) {
    return <div className="text-center py-12 text-gray-500">Loading feature sliders...</div>;
  }

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <TooltipProvider>
      <Card className="w-full bg-white shadow-lg border-blue-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <span>📋 Feature Input</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Adjust the cell nucleus measurements below
          </p>
        </CardHeader>

        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {featureGroups.map((group) => (
            <Collapsible
              key={group.title}
              open={openSections[group.title]}
              onOpenChange={() => toggleSection(group.title)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="font-medium text-blue-800">{group.title}</span>
                {openSections[group.title] ? (
                  <ChevronUp className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-3 space-y-4">
                {group.features.map((feature) => {
                  const stats = featureStats[feature.key];
                  if (!stats) {
                    console.warn(`Missing stats for ${feature.key}`);
                    return null;
                  }

                  return (
                    <div key={feature.key} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 flex-1">
                          {feature.label}
                        </label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{feature.description}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              Min: {stats.min.toFixed(2)} | Mean: {stats.mean.toFixed(2)} | Max: {stats.max.toFixed(2)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FeatureSlider
                        value={features[feature.key]}
                        onChange={(value) => updateFeature(feature.key, value)}
                        min={0}
                        max={stats.max}
                        step={feature.step}
                      />
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>

        <div className="p-6 pt-4 border-t border-gray-100">
          <Button
            onClick={onPredict}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                🎯 Predict
              </>
            )}
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
