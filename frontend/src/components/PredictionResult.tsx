
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PredictionResultProps {
  prediction: {
    result: string;
    benign_probability: number;
    malignant_probability: number;
  } | null;
  error: string | null;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, error }) => {
  if (error) {
    return (
      <Card className="w-full bg-red-50 border-red-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-red-800 flex items-center space-x-2">
            <XCircle className="h-6 w-6" />
            <span>Prediction Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return null;
  }

  const isBenign = prediction.result === 'Benign';
  const bgColor = isBenign ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isBenign ? 'border-green-200' : 'border-red-200';
  const textColor = isBenign ? 'text-green-800' : 'text-red-800';
  const iconColor = isBenign ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <Card className={`w-full ${bgColor} ${borderColor} shadow-lg`}>
        <CardHeader className="pb-4">
          <CardTitle className={`text-2xl ${textColor} flex items-center space-x-3`}>
            {isBenign ? (
              <CheckCircle className={`h-8 w-8 ${iconColor}`} />
            ) : (
              <AlertTriangle className={`h-8 w-8 ${iconColor}`} />
            )}
            <span>Prediction: {prediction.result}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Probability Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-green-700">Benign Probability</span>
                <span className="text-sm font-bold text-green-800">
                  {(prediction.benign_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${prediction.benign_probability * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-red-700">Malignant Probability</span>
                <span className="text-sm font-bold text-red-800">
                  {(prediction.malignant_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${prediction.malignant_probability * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer Card */}
      <Card className="w-full bg-yellow-50 border-yellow-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Medical Disclaimer</p>
              <p>
                This prediction tool is for educational and research purposes only. 
                It should never be used as a substitute for professional medical advice, 
                diagnosis, or treatment. Always consult with qualified healthcare 
                professionals for medical concerns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
