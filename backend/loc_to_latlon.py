from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()
API_KEY = os.getenv('API_KEY')

@app.route('/geocode', methods=['GET'])
def getGeoCoord():
    address = request.args.get('address', 'Chicago')

    params = {
        'key': API_KEY,
        'address': address.replace(' ', '+')
    }

    base_url = 'https://maps.googleapis.com/maps/api/geocode/json?'
    response = requests.get(base_url, params=params)
    data = response.json()
    
    if data['status'] == 'OK':
        result = data['results'][0]
        location = result['geometry']['location']
        return jsonify({
            'latitude': location['lat'],
            'longitude': location['lng']
        })
    else:
        return jsonify({'error': 'Geocoding failed'}), 400

if __name__ == '__main__':
    app.run(debug=True)