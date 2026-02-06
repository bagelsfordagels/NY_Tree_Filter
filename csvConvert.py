import pandas as pd

def xToBool(value):
    text = str(value)
    text = text.strip()
    text = text.lower()

    if text == "x":
        return 1
    else: return 0

while(True):
    fileName = input("Enter name of file (or stop to exit): ")
    if fileName.lower() == 'stop':
        break
    
    df = pd.read_csv(f'./csv_files/{fileName}.csv', header=0);
    # add TreeID starting at 1
    df.insert(0, "TreeID", range(1, len(df) + 1))
    df.iloc[1:,1:] = df.iloc[1:,1:].map(xToBool) # [row, clumn] 1: skip first look at rest

    print(df);

    df.to_csv(f'./bool_csv/{fileName}_BinBool.csv',index=False);
    
