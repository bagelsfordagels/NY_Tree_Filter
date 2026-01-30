import pandas as pd

def xToBool(value):
    text = str(value)
    text = text.strip()
    text = text.lower()

    if text == "x":
        return True
    else: return False

while(True):
    fileName = input("Enter name of file (or stop to exit): ")
    if fileName.lower() == 'stop':
        break
    
    df = pd.read_csv(f'./csv_files/{fileName}.csv', header=0);
    df.iloc[1:,0] = df.iloc[1:,0].map(xToBool) # [row, clumn] 1: skip first look at rest

    print(df);

    df.to_csv(f'./bool_csv/{fileName}_Bool.csv',index=False);
    
