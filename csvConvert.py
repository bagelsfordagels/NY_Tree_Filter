import pandas as pd

def xToBool(value):
    text = str(value)
    text = text.strip()
    text = text.lower()

    if text == "x":
        return True
    else: return False
    
df = pd.read_csv('./csv_files/SAF_Forest_Type.csv', header=0);
df.iloc[1:] = df.iloc[1:].map(xToBool)

print(df.head);