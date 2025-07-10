
import React from 'react';
import { Activity } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Breast Cancer Prediction
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Advanced Medical Analysis Tool
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
