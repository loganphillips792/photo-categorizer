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

@main_bp.route('/add_user/<username>/<email>')
def add_user(username, email):
    """Adds a new user to the database."""
    try:
        new_user = User(username=username, email=email)
        db.session.add(new_user)
        db.session.commit()
        current_app.logger.info(f'Added user: {username}')
        return jsonify({'message': f'User {username} added successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error adding user {username}: {e}')
        return jsonify({'error': str(e)}), 500

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