from flask import Blueprint, current_app, jsonify, request

# Import db instance and User model
from app import db
from models import User

# Create a Blueprint named 'main'
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def hello_world():
    # Use current_app.logger which refers to the app's logger
    current_app.logger.info('Processing request for / route')
    return 'Hello from Flask Backend!'

@main_bp.route('/add_user', methods=['POST'])
def add_user():
    """Adds a new user to the database using data from JSON request body."""
    data = request.get_json()
    if not data or not 'username' in data or not 'email' in data or not 'password' in data:
        return jsonify({'error': 'Missing data: username, email, and password required'}), 400

    username = data['username']
    email = data['email']
    password = data['password']

    try:
        # Check if user already exists
        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return jsonify({'error': 'Username or email already exists'}), 409

        new_user = User(username=username, email=email)
        new_user.set_password(password)  # Hash the password
        db.session.add(new_user)
        db.session.commit()
        current_app.logger.info(f'Added user: {username}')
        return jsonify({'message': f'User {username} added successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error adding user {username}: {e}')
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@main_bp.route('/users')
def get_users():
    """Returns a list of all users."""
    try:
        users = User.query.all()
        user_list = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
        current_app.logger.info('Retrieved user list')
        return jsonify(user_list), 200
    except Exception as e:
        current_app.logger.error(f'Error retrieving users: {e}')
        return jsonify({'error': str(e)}), 500