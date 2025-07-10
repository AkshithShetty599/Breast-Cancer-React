import numpy as np
import pickle
from config.utils import scale_input,get_clean_data

MODEL_VERSION = '1.0.0'

# Load model at import time to avoid reloading for every request
with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_diagnosis(input_dict: dict) -> dict:
    
    input_array = np.array(list(input_dict.values())).reshape(1,-1)

    prediction = model.predict(input_array)[0]
    probabilities = model.predict_proba(input_array)[0]

    return {
        "result": "Benign" if prediction == 0 else "Malicious",
        "benign_probability": float(probabilities[0]),
        "malignant_probability": float(probabilities[1])
    }

