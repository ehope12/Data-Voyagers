from flask import Blueprint, request, jsonify
from datetime import datetime
from services.landsat_services import calculate_next_overpass, setup_notification

landsat_bp = Blueprint('landsat_bp', __name__)

@landsat_bp.route('/next_overpass', methods=['GET'])
def next_overpass():
    try:
        # Extract latitude, longitude, and landsat number from request parameters
        latitude = float(request.args.get('latitude'))
        longitude = float(request.args.get('longitude'))
        landsat_number = int(request.args.get('landsat_number'))

        # Extract start and end dates from request parameters, if provided
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')

        # Convert start and end dates from string to datetime objects
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d') if start_date_str else None
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d') if end_date_str else None

        # Calculate the next overpass time
        next_overpass_time = calculate_next_overpass(latitude, longitude, landsat_number, start_date, end_date)
        print("Next Overpass Time:", next_overpass_time)  # Debugging line

        # Ensure that next_overpass_time is a valid datetime object
        if next_overpass_time and isinstance(next_overpass_time, datetime):
            return jsonify({
                'success': True,
                'next_overpass_time': next_overpass_time.isoformat() + 'Z'  # Use ISO format
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
        
        time_unit = data.get('timeUnit', 'minutes')
        lead_time_value = int(data.get('lead_time_value', 0))
        if time_unit == 'hours':
            notification_lead_time_minutes = lead_time_value * 60
        elif time_unit == 'days':
            notification_lead_time_minutes = lead_time_value * 1440
        else:
            notification_lead_time_minutes = lead_time_value
        
        notification_method = data['notification_method']
        email = data.get('email')

        result = setup_notification(latitude, longitude, landsat_number, notification_lead_time_minutes, notification_method, email)
        
        # Return next_overpass_time if available
        if result.get('success') and 'next_overpass_time' in result:
            return jsonify({
                'success': True,
                'message': result['message'],
                'next_overpass_time': result['next_overpass_time']  # Use the correct key
            })
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
