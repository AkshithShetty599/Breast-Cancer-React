
export interface FeatureData {
  // Mean values
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  symmetry_mean: number;
  fractal_dimension_mean: number;
  
  // SE values
  radius_se: number;
  texture_se: number;
  perimeter_se: number;
  area_se: number;
  smoothness_se: number;
  compactness_se: number;
  concavity_se: number;
  concave_points_se: number;
  symmetry_se: number;
  fractal_dimension_se: number;
  
  // Worst values
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  smoothness_worst: number;
  compactness_worst: number;
  concavity_worst: number;
  concave_points_worst: number;
  symmetry_worst: number;
  fractal_dimension_worst: number;
}

export interface FeatureConfig {
  key: keyof FeatureData;
  label: string;
  min: number;
  max: number;
  step: number;
  description: string;
}
