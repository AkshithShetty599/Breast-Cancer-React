from pydantic import BaseModel
from typing import Dict

class PredictionResponse(BaseModel):
    result: str
    benign_probability: float
    malignant_probability: float
