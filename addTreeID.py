import pandas as pd
fileName = input("Enter name of file (or stop to exit): ")

df = pd.read_csv(f'./csv_files/{fileName}.csv', header=0);

df.insert(0, "TreeID", range(1, len(df) + 1))

print(df);

df.to_csv(f'./bool_csv/{fileName}.csv',index=False);