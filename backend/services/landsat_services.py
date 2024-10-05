import requests
from skyfield.api import EarthSatellite, load, Topos
from datetime import datetime, timedelta, timezone
import math

LANDSAT_9_CATALOG_NUM = 49260
LANDSAT_8_CATALOG_NUM = 39084
COVERAGE_OF_EARTH_IN_DAYS = 16

def get_tle_from_celestrak(catalog_number):
    url = f"https://celestrak.org/NORAD/elements/gp.php?CATNR={catalog_number}&FORMAT=TLE"
    response = requests.get(url)
    
    if response.status_code == 200:
        tle_data = response.text.strip().splitlines()
        if len(tle_data) >= 3:
            return tle_data[1], tle_data[2]
        else:
            raise Exception("Incomplete TLE data received from CelesTrak")
    else:
        raise Exception(f"Failed to retrieve TLE data. Status Code: {response.status_code}")

def calculate_next_overpass(latitude, longitude, landsat_number):
    try:
        # Select catalog number based on Landsat selection
        if landsat_number == 8:
            catalog_number = LANDSAT_8_CATALOG_NUM
            altitude_degrees = 90 - math.degrees(math.atan((180 / 2) / 705))
        elif landsat_number == 9:
            catalog_number = LANDSAT_9_CATALOG_NUM
            altitude_degrees = 90 - math.degrees(math.atan((115 / 2) / 438))
        else:
            raise ValueError("Invalid Landsat number. Please select 8 or 9.")
        
        # Get TLE data for Landsat
        tle_line_1, tle_line_2 = get_tle_from_celestrak(catalog_number)

        # Create a satellite object with Skyfield
        ts = load.timescale()
        satellite = EarthSatellite(tle_line_1, tle_line_2, f"Landsat {landsat_number}", ts)

        # Define observer's location (Topos)
        observer = Topos(latitude_degrees=latitude, longitude_degrees=longitude)

        # Search for the next overpass in the next days
        t0 = ts.utc(datetime.now(tz=timezone.utc))
        t1 = t0 + timedelta(days=COVERAGE_OF_EARTH_IN_DAYS)

        # Find the next overpass events
        t, is_visible = satellite.find_events(observer, t0, t1, altitude_degrees=altitude_degrees)

        # Return the next overpass time if found
        for ti, event_type in zip(t, is_visible):
            if event_type == 0:  # Satellite rising
                return ti.utc_datetime()

        return None  # No overpass found within the next day

    except Exception as e:
        raise RuntimeError(f"Error calculating overpass: {e}")
