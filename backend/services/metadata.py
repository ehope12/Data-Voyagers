import pandas as pd

# Load the dataset with a different encoding
data_file_path = 'landsat_ot_c2_l1_670153c03e725e13.csv'  # Update with your actual data file name

# Try reading with a different encoding
df = None  # Initialize df to None
try:
    df = pd.read_csv(data_file_path, encoding='ISO-8859-1')  # or try 'utf-16'
except UnicodeDecodeError as e:
    print(f"Error reading the CSV file: {e}")
    exit(1)
except FileNotFoundError as e:
    print(f"File not found: {e}")
    exit(1)  # Exit if the file isn't found
except Exception as e:
    print(f"An error occurred: {e}")
    exit(1)  # Exit for any other errors

# Check if df is None (indicating a failure to load)
if df is None:
    print("DataFrame could not be loaded.")
    exit(1)  # Exit if df is not loaded

# Define a function to find records based on WRS path and row
def find_records(wrs_path, wrs_row):
    # Filter the DataFrame based on the WRS path and row
    filtered_df = df[(df['WRS Path'] == wrs_path) & (df['WRS Row'] == wrs_row)]
    
    # Check if any records are found
    if filtered_df.empty:
        print(f"No records found for WRS Path: {wrs_path} and WRS Row: {wrs_row}")
    else:
        # Find the most recent date in the filtered DataFrame
        most_recent_date = filtered_df['Date Acquired'].max()
        
        # Filter for records with the most recent date
        recent_records = filtered_df[filtered_df['Date Acquired'] == most_recent_date]

        # Print relevant information for the most recent record(s)
        for index, row in recent_records.iterrows():
            print(f"Acquisition Satellite: {row['Satellite']}")
            print(f"Date: {row['Date Acquired']}")  # Get the date part of datetime
            print(f"Time: {row['Start Time']}")
            # print(f"Latitude: {row['Latitude']}")
            # print(f"Longitude: {row['Longitude']}")
            print(f"WRS Path: {row['WRS Path']}")
            print(f"WRS Row: {row['WRS Row']}")
            print(f"Percent Cloud Cover: {row['Land Cloud Cover']}")
            print(f"Image Quality: {row['Image Quality']}")
            print("-" * 40)

# User inputs for WRS path and row
try:
    wrs_path_input = int(input("Enter WRS Path: "))
    wrs_row_input = int(input("Enter WRS Row: "))
except ValueError:
    print("Please enter valid integer values for WRS Path and WRS Row.")
    exit(1)

# Call the function with user inputs
find_records(wrs_path_input, wrs_row_input)