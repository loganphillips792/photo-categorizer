import os

from flask import Flask

from logging.config import dictConfig
from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS # Import CORS
# Load environment variables from .env file
load_dotenv()
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__)

# Initialize CORS after creating the app instance
# Allow all origins for development. Restrict this in production!
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure the database URI. Using SQLite for this example.
# It's recommended to use environment variables for sensitive data.
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mydatabase.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Disable modification tracking

# Configure JWT
# It's recommended to use a strong, random secret key stored in environment variables
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret') # Change this in production!

# Initialize SQLAlchemy AFTER app configuration
db = SQLAlchemy(app)
# Initialize JWTManager AFTER app configuration
jwt = JWTManager(app)

# Import blueprints AFTER db is initialized to avoid circular imports
from routes import main_bp
import models # Import models to ensure they are registered with SQLAlchemy

# Register the Blueprint
app.register_blueprint(main_bp)

# Create database tables if they don't exist
# This needs the app context
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)