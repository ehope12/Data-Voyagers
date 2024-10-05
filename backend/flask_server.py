from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

load_dotenv()
API_KEY = os.getenv('API_KEY')

@app.route('/geocode', methods=['POST'])
def get_geo_coord():
    data = request.get_json()
    input_value = data.get('input', 'Chicago')

    params = {
        'key': API_KEY,
        'address': input_value.replace(' ', '+')
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
        }), 200
    else:
        return jsonify({'error': 'Geocoding failed'}), 400

if __name__ == '__main__':
    app.run(debug=True)