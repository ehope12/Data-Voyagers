from flask import Blueprint, request, jsonify

# Import the service function (currently not used in the route but will be used later)
from backend.services.minigrid_services import get_cloud_cover_percentage

# Define the Blueprint for this set of routes
pixel_grid_bp = Blueprint('pixel_grid', __name__)

# Define a blank route that will eventually call the cloud cover service
@pixel_grid_bp.route('/get_3x3_pixel_grid', methods=['GET'])
#def get_cloud_cover():
