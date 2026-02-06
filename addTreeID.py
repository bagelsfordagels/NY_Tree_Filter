import pandas as pd
def NA(value):
    if pd.isnull(value):
        return "Uncertain"
    return value
fileName = input("Enter name of file (or stop to exit): ")

df = pd.read_csv(f'./csv_files/{fileName}.csv', header=0);

df.insert(0, "TreeID", range(1, len(df) + 1))
df.iloc[1:,1:] = df.iloc[1:,1:].map(NA) # [row, clumn] 1: skip first look at rest
print(df);

df.to_csv(f'./bool_csv/{fileName}.csv',index=False);