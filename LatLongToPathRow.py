from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import pyautogui
import requests
from bs4 import BeautifulSoup
import re
import numpy as np
import pandas as pd
import pytesseract 
import matplotlib.pyplot as plt
import statistics
import cv2
import sys

# Function to interact with the Landsat page and fetch path/row
def get_landsat_path_row(lat, lon):
    # Set up the WebDriver (Chrome in this case)
    driver = webdriver.Chrome()  # Ensure ChromeDriver is installed
    driver.get('https://landsat.usgs.gov/landsat_acq#convertPathRow')

    # Allow the page to load
    time.sleep(3)

    # Locate latitude and longitude input fields by their IDs
    lat_input = driver.find_element(By.ID, 'thelat')
    lon_input = driver.find_element(By.ID, 'thelong')

    # Input the latitude and longitude values
    lat_input.clear()
    lat_input.send_keys(str(lat))
    
    lon_input.clear()
    lon_input.send_keys(str(lon))
    
    # Locate the convert button and simulate a click
    convert_button = driver.find_element(By.ID, 'convert')
    convert_button.click()

    # Wait for the results to load
    time.sleep(1)

    # Extract the path/row values from the table rows
    table_rows = driver.find_elements(By.XPATH, '//*[@id="convertTableRows"]/tr')

    # Collect the path/row options into a list
    path_row_options = []
    for row in table_rows:
        columns = row.find_elements(By.TAG_NAME, 'td')
        path = columns[0].text
        row_num = columns[1].text
        lat_val = columns[2].text
        lon_val = columns[3].text
        l8_acq = columns[4].text
        l9_acq = columns[5].text
        path_row_options.append({
            'Path': path,
            'Row': row_num,
            'Lat': lat_val,
            'Lon': lon_val,
            'L8 Next Acq': l8_acq,
            'L9 Next Acq': l9_acq
        })

    # Close the browser
    driver.quit()

    #return path_row_options

# This is the value we want: the most recent landsat
    resultant_path_row = path_row_options[0]

    #latitude = user input
    #longitude = user input

    return 'Path: ' + resultant_path_row['Path'] + ' Row: ' + resultant_path_row['Row']

latitude = 45.23
longitude = -56.34
path_row_options = get_landsat_path_row(latitude, longitude)
print("Available Path/Row Options:")
for option in path_row_options:
    print(option)