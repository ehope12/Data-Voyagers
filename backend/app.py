from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
from routes.landsat_routes import landsat_bp
from routes.geocode_routes import geocode_bp
from routes.minigrid_routes import pixel_grid_bp

app = Flask(__name__)

# Allow cross-origin resource sharing
CORS(app)

# Load environment variables
load_dotenv()

# Register blueprints
app.register_blueprint(landsat_bp, url_prefix='/landsat')
app.register_blueprint(geocode_bp, url_prefix='/geocode')
app.register_blueprint(pixel_grid_bp, url_prefix='/pixel_grid')

if __name__ == '__main__':
    app.run(debug=True)
