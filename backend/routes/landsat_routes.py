from flask import Blueprint, request, jsonify
from services.landsat_services import calculate_next_overpass, setup_notification

landsat_bp = Blueprint('landsat_bp', __name__)

@landsat_bp.route('/next_overpass', methods=['GET'])
def next_overpass():
    try:
        latitude = float(request.args.get('latitude'))
        longitude = float(request.args.get('longitude'))
        landsat_number = int(request.args.get('landsat_number'))

        next_overpass_time = calculate_next_overpass(latitude, longitude, landsat_number)
        if next_overpass_time:
            return jsonify({
                'success': True,
                'next_overpass_time': next_overpass_time.strftime('%Y-%m-%d %H:%M:%S UTC')
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Unable to determine the next overpass time.'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@landsat_bp.route('/setup_notification', methods=['POST'])
def setup_notification_route():
    try:
        data = request.get_json()
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])
        landsat_number = int(data['landsat_number'])
        notification_lead_time_minutes = int(data['notification_lead_time_minutes'])
        notification_method = data['notification_method']

        result = setup_notification(latitude, longitude, landsat_number, notification_lead_time_minutes, notification_method)
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
