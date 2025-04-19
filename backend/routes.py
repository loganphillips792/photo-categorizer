from functools import wraps
from flask import Blueprint, current_app, jsonify, request, make_response
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt,
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)

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
    
    current_app.logger.info(
        f"Adding the following user to the database:\n"
        f"  Username: {username}\n"
        f"  Email: {email}\n"
        f"  Password: [REDACTED]" # Redact password for security
    )
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

# --- Custom Decorators ---

def admin_required():
    """Decorator to ensure the user has the 'admin' role."""
    def wrapper(fn):
        @wraps(fn)
        @jwt_required() # Ensures a valid JWT is present first
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") == "admin":
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Admins only!"), 403
        return decorator
    return wrapper

# --- User Routes ---

@main_bp.route('/users')
@admin_required() # Apply the custom decorator
def get_users():
    """Returns a list of all users."""
    try:
        users = User.query.all()
        # Include role in the returned user list
        user_list = [{'id': user.id, 'username': user.username, 'email': user.email, 'role': user.role} for user in users]
        current_app.logger.info('Retrieved user list')
        return jsonify(user_list), 200
    except Exception as e:
        current_app.logger.error(f'Error retrieving users: {e}')
        return jsonify({'error': str(e)}), 500

# --- Authentication Routes ---

@main_bp.route('/login', methods=['POST'])
def login():
    """Authenticates a user and returns JWT tokens."""
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Missing username or password'}), 400

    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # Identity must be JSON serializable (string is recommended)
        # Add role to additional claims
        additional_claims = {"role": user.role}
        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=str(user.id))
        current_app.logger.info(f'User {username} logged in successfully.')
        # Create response object
        response = make_response(jsonify({"msg": "Login successful", "user": {"id": user.id, "username": user.username, "role": user.role}}), 200)
        # Set cookies
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response
    else:
        current_app.logger.warning(f'Failed login attempt for username: {username}')
        return jsonify({'error': 'Invalid credentials'}), 401

@main_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refreshes an access token."""
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    current_app.logger.info(f'Refreshed token for user ID: {current_user_id}')
    response = make_response(jsonify({"msg": "Token refreshed"}), 200)
    set_access_cookies(response, new_access_token)
    return response

@main_bp.route('/logout', methods=['POST'])
def logout():
    """Logs the user out by unsetting JWT cookies."""
    response = make_response(jsonify({"msg": "Logout successful"}), 200)
    unset_jwt_cookies(response)
    current_app.logger.info("User logged out.")
    return response

# --- Protected Routes ---

# Category Routes
@main_bp.route('/categories', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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


# --- File Upload Route ---

@main_bp.route('/upload', methods=['POST'])
@jwt_required() # Optional: Uncomment if upload should require authentication
def upload_photos():
    current_app.logger.info("upload_photos()")
    """Handles file uploads, expects files under the 'files' key."""
    if 'files' not in request.files:
        current_app.logger.warning("Upload attempt with no 'files' key in request.files")
        return jsonify({'error': "No 'files' key found in the request"}), 400

    files = request.files.getlist('files') # Get list of files under the 'files' key

    if not files or all(f.filename == '' for f in files):
        current_app.logger.warning("Upload attempt with no selected files")
        return jsonify({'error': 'No selected files'}), 400

    processed_files = []
    try:
        current_app.logger.info(f"Received {len(files)} file(s) for upload.")
        for file in files:
            if file and file.filename: # Check if file exists and has a filename
                # --- Process the file ---
                # For now, just log the filename
                current_app.logger.info(f"Processing file: {file.filename}")
                processed_files.append(file.filename)

                # TODO: Add logic here to save the file, categorize it, etc.
                # Example: file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename))

        current_app.logger.info(f"Successfully processed {len(processed_files)} file(s).")
        return jsonify({
            'message': f'Successfully processed {len(processed_files)} file(s).',
            'processed_filenames': processed_files
        }), 200

    except Exception as e:
        current_app.logger.error(f'Error during file upload processing: {e}')
        return jsonify({'error': f'Internal server error during upload: {str(e)}'}), 500