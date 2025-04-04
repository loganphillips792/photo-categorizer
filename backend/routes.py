from flask import Blueprint, current_app, jsonify, request

# Import db instance and User model
from app import db
from models import User, Category

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


# Category Routes
@main_bp.route('/categories', methods=['GET'])
def get_categories():
    """Returns a list of all categories."""
    try:
        categories = Category.query.all()
        category_list = [{'id': category.id, 'name': category.name, 'description': category.description} for category in categories]
        current_app.logger.info('Retrieved category list')
        return jsonify(category_list), 200
    except Exception as e:
        current_app.logger.error(f'Error retrieving categories: {e}')
        return jsonify({'error': str(e)}), 500

@main_bp.route('/categories', methods=['POST'])
def add_category():
    """Adds a new category to the database."""
    data = request.get_json()
    if not data or not 'name' in data:
        return jsonify({'error': 'Missing data: name is required'}), 400

    name = data['name']
    description = data.get('description', '') # Optional description

    try:
        # Check if category already exists
        if Category.query.filter_by(name=name).first():
            return jsonify({'error': 'Category name already exists'}), 409

        new_category = Category(name=name, description=description)
        db.session.add(new_category)
        db.session.commit()
        current_app.logger.info(f'Added category: {name}')
        # Return the created category object
        return jsonify({'id': new_category.id, 'name': new_category.name, 'description': new_category.description}), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error adding category {name}: {e}')
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@main_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Returns a specific category by ID."""
    try:
        category = Category.query.get_or_404(category_id)
        current_app.logger.info(f'Retrieved category: {category.name}')
        return jsonify({'id': category.id, 'name': category.name, 'description': category.description}), 200
    except Exception as e:
        current_app.logger.error(f'Error retrieving category {category_id}: {e}')
        return jsonify({'error': str(e)}), 500

@main_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Updates a specific category by ID."""
    category = Category.query.get_or_404(category_id)
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Check for potential duplicate name if name is being updated
    if 'name' in data and data['name'] != category.name:
        if Category.query.filter(Category.id != category_id, Category.name == data['name']).first():
            return jsonify({'error': 'Category name already exists'}), 409
        category.name = data['name']

    if 'description' in data:
        category.description = data['description']

    try:
        db.session.commit()
        current_app.logger.info(f'Updated category: {category.name}')
        return jsonify({'id': category.id, 'name': category.name, 'description': category.description}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating category {category_id}: {e}')
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@main_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Deletes a specific category by ID."""
    category = Category.query.get_or_404(category_id)
    try:
        db.session.delete(category)
        db.session.commit()
        current_app.logger.info(f'Deleted category: {category.name}')
        return jsonify({'message': f'Category {category.name} deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting category {category_id}: {e}')
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500