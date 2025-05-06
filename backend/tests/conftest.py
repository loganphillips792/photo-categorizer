import pytest
import os
import tempfile

# Import the Flask app and db instance
# We need to adjust the Python path potentially or ensure the tests run from the correct directory
# Assuming tests run from the root 'photo-categorizer' directory or backend directory
import sys
# Add the backend directory to the path to find modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app as flask_app, db as sqlalchemy_db
# Import the Category model
from models import Category

@pytest.fixture(scope='session')
def app():
    """Create and configure a new app instance for each test session."""
    # Create a temporary file for the SQLite database
    db_fd, db_path = tempfile.mkstemp()

    # Configure the app for testing
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        # Add other test-specific configurations if needed
        # e.g., SECRET_KEY for session management if testing authenticated routes
        "SECRET_KEY": "test-secret-key"
    })

    # Create the database and the database table(s)
    with flask_app.app_context():
        sqlalchemy_db.create_all()

    yield flask_app

    # Close and remove the temporary database file
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture()
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture()
def db(app):
    """Session-wide test database."""
    with app.app_context():
        # Ensure tables are created
        sqlalchemy_db.create_all()
        # Optional: Clean up tables before each test if needed,
        # but usually better to handle cleanup within tests or specific fixtures
        # sqlalchemy_db.drop_all()
        # sqlalchemy_db.create_all()

    yield sqlalchemy_db

    # Optional: Clean up database after each test if necessary
    # with app.app_context():
    #     sqlalchemy_db.session.remove()
    #     sqlalchemy_db.drop_all()

@pytest.fixture(autouse=True)
def manage_db_session(app, db):
    """Ensure each test runs in its own transaction, clears tables, and rolls back."""
    with app.app_context():
        # Clear relevant tables before the test runs
        # This ensures a clean slate even if previous rollbacks failed or data was committed unexpectedly
        db.session.query(Category).delete()
        # Add other models here if necessary, e.g., db.session.query(Photo).delete()
        db.session.commit() # Commit the deletion

        # Start a nested transaction for the test itself
        db.session.begin_nested()
        try:
            yield # Run the test
        finally:
            # Rollback the test's transaction
            db.session.rollback()
            # Rollback the test's transaction
        db.session.rollback()