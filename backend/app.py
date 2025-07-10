from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schema.input_pydantic import generate_dynamic_input_model
from schema.response_pydandic import PredictionResponse
from model.predict import predict_diagnosis, model, MODEL_VERSION
from config.utils import get_clean_data
import os

# Generate the dynamic input model
InputFeatures = generate_dynamic_input_model()

app = FastAPI(title="Breast Cancer Prediction API")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Breast Cancer Prediction API is running"}

@app.get("/health")
def health_check():
    try:
        is_model_loaded = model is not None
        return {
            "status": "OK",
            "version": MODEL_VERSION,
            "model_loaded": is_model_loaded
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Health check failed")

@app.get("/feature-stats")
def get_feature_stats():
    df = get_clean_data()
    df.columns = df.columns.str.strip().str.replace(" ", "_") 
    stats = {}
    for col in df.columns:
        if col == 'diagnosis':
            continue
        stats[col] = {
            "min": df[col].min(),
            "max": df[col].max(),
            "mean": df[col].mean()
        }

    return stats


@app.post("/predict", response_model=PredictionResponse)
def predict(input_data: InputFeatures):  # ✅ Now works fine
    try:
        input_dict = input_data.model_dump(by_alias=True)  # ⬅ ensures alias fields are preserved
        result = predict_diagnosis(input_dict)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
