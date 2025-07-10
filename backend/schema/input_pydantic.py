from pydantic import create_model, Field
from config.utils import get_clean_data
import pandas as pd

def generate_dynamic_input_model():
    df = get_clean_data()

    fields = {}

    for col in df.columns:
        if col == 'diagnosis':
            continue

        min_val = float(df[col].min())
        max_val = float(df[col].max())
        mean_val = float(df[col].mean())

        alias = col if ' ' in col else None
        field_info = Field(
            default=mean_val,
            gt=min_val - 1,
            lt=max_val + 1,
            description=f"Field for {col}",
            alias=alias,
        )

        field_name = col.replace(" ", "_")
        fields[field_name] = (float, field_info)

    # ✅ In Pydantic v2, pass `__config__` as dict
    model = create_model(
        "InputFeatures",
        **fields,
        __config__={"populate_by_name": True}
    )

    return model
