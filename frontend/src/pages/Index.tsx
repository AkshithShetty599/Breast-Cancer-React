import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { InputForm } from '@/components/InputForm';
import { RadarVisualization } from '@/components/RadarVisualization';
import { PredictionResult } from '@/components/PredictionResult';
import { FeatureData } from '@/types/FeatureData';
import axios from 'axios';

const Index = () => {
  const [features, setFeatures] = useState<FeatureData | null>(null);
  const [featureStats, setFeatureStats] = useState<{ [key in keyof FeatureData]: { min: number; max: number; mean: number } } | null>(null);

  const [prediction, setPrediction] = useState<{
    result: string;
    benign_probability: number;
    malignant_probability: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Fetch feature stats and set mean values
  useEffect(() => {
    axios.get('http://localhost:8000/feature-stats')  // replace with your deployed backend URL
      .then((res) => {
        const stats = res.data;
        setFeatureStats(stats);

        // Initialize features with mean values
        const means: FeatureData = Object.keys(stats).reduce((acc, key) => {
          acc[key as keyof FeatureData] = stats[key].mean;
          return acc;
        }, {} as FeatureData);

        setFeatures(means);
      })
      .catch((err) => {
        setError('Failed to fetch feature stats.');
        console.error(err);
      });
  }, []);

  const updateFeature = (key: keyof FeatureData, value: number) => {
    setFeatures(prev => ({
      ...prev!,
      [key]: value
    }));
  };

  const handlePredict = async () => {
    if (!features) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:8000/predict',
        features
      );

      setPrediction(response.data);
    } catch (err) {
      setError('Unable to connect to prediction service. Please try again later.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!features || !featureStats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading model inputs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-6">
            <InputForm
              features={features}
              updateFeature={updateFeature}
              onPredict={handlePredict}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Visualization and Results */}
          <div className="space-y-6">
            <RadarVisualization features={features} />

            {(prediction || error) && (
              <PredictionResult
                prediction={prediction}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
