import pandas as pd

def get_clean_data():
    data = pd.read_csv("data/data.csv")
    data = data.drop(['Unnamed: 32', 'id'], axis=1)
    data['diagnosis'] = data['diagnosis'].map({'M': 1, 'B': 0})
    return data

def scale_input(input_dict):
    data = get_clean_data()
    X = data.drop(['diagnosis'], axis=1)

    # Create a mapping from underscore names to original column names
    key_map = {col.replace(" ", "_"): col for col in X.columns}

    scaled_dict = {}

    for key, value in input_dict.items():
        actual_key = key_map.get(key, key)  # Map to original column name

        max_val = X[actual_key].max()
        min_val = X[actual_key].min()
        range_val = max_val - min_val

        # Avoid division by zero
        scaled_value = (value - min_val) / range_val if range_val != 0 else 0.0
        scaled_dict[actual_key] = scaled_value

    return scaled_dict
