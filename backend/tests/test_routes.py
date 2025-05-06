import json
import pytest

# Import the db instance and models needed for testing
# Assuming conftest.py correctly sets up the path
from app import db
from models import Category, User # Import User if testing user routes too

# Basic test for the root endpoint
def test_hello_world(client):
    """Test the hello world route."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello from Flask Backend!' in response.data

# === Category Route Tests ===

def test_get_categories_empty(client):
    # Test GET /categories when no categories exist.
    response = client.get('/categories')
    assert response.status_code == 200
    assert response.json == []


def test_add_category_success(client, db):
    # Test POST /categories successfully adds a category.
    response = client.post('/categories', json={
        'name': 'Landscapes',
        'description': 'Photos of nature scenes'
    })
    assert response.status_code == 201
    data = response.json
    assert data['name'] == 'Landscapes'
    assert data['description'] == 'Photos of nature scenes'
    assert 'id' in data

    # Verify it's in the database
    category = db.session.get(Category, data['id'])
    assert category is not None
    assert category.name == 'Landscapes'

def test_add_category_missing_name(client):
    # Test POST /categories with missing name field.
    response = client.post('/categories', json={'description': 'Missing name'})
    assert response.status_code == 400
    assert 'error' in response.json
    assert 'Missing data: name is required' in response.json['error']

def test_add_category_duplicate_name(client, db):
    # Test POST /categories with a duplicate name.
    # Add initial category
    cat1 = Category(name='Portraits', description='People pictures')
    db.session.add(cat1)
    db.session.commit() # Commit here because the test request runs in its own transaction context

    # Attempt to add another with the same name
    response = client.post('/categories', json={'name': 'Portraits'})
    assert response.status_code == 409
    assert 'error' in response.json
    assert 'Category name already exists' in response.json['error']

def test_get_categories_with_data(client, db):
    # Test GET /categories returns existing categories.
    cat1 = Category(name='Nature', description='Outdoors')
    cat2 = Category(name='City', description='Urban shots')
    db.session.add_all([cat1, cat2])
    db.session.commit()

    response = client.get('/categories')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2
    assert any(c['name'] == 'Nature' for c in data)
    assert any(c['name'] == 'City' for c in data)

def test_get_specific_category_success(client, db):
    # Test GET /categories/<id> successfully retrieves a category.
    cat = Category(name='Animals', description='Wildlife')
    db.session.add(cat)
    db.session.commit() # Need ID assigned

    response = client.get(f'/categories/{cat.id}')
    assert response.status_code == 200
    data = response.json
    assert data['id'] == cat.id
    assert data['name'] == 'Animals'
    assert data['description'] == 'Wildlife'

def test_get_specific_category_not_found(client):
    # Test GET /categories/<id> for a non-existent category.
    response = client.get('/categories/999')
    assert response.status_code == 404 # Flask-SQLAlchemy's get_or_404 triggers this

def test_update_category_success(client, db):
    # Test PUT /categories/<id> successfully updates a category.
    cat = Category(name='Old Name', description='Old Desc')
    db.session.add(cat)
    db.session.commit()

    response = client.put(f'/categories/{cat.id}', json={
        'name': 'New Name',
        'description': 'New Desc'
    })
    assert response.status_code == 200
    data = response.json
    assert data['name'] == 'New Name'
    assert data['description'] == 'New Desc'

    # Verify update in DB
    updated_cat = db.session.get(Category, cat.id)
    assert updated_cat.name == 'New Name'
    assert updated_cat.description == 'New Desc'

def test_update_category_partial(client, db):
    # Test PUT /categories/<id> updates only provided fields.
    cat = Category(name='Partial Update', description='Keep this')
    db.session.add(cat)
    db.session.commit()

    response = client.put(f'/categories/{cat.id}', json={'name': 'Updated Name Only'})
    assert response.status_code == 200
    data = response.json
    assert data['name'] == 'Updated Name Only'
    assert data['description'] == 'Keep this' # Description should remain unchanged

    # Verify update in DB
    updated_cat = db.session.get(Category, cat.id)
    assert updated_cat.name == 'Updated Name Only'
    assert updated_cat.description == 'Keep this'

def test_update_category_duplicate_name(client, db):
    # Test PUT /categories/<id> prevents updating to a duplicate name.
    cat1 = Category(name='Unique One', description='Desc 1')
    cat2 = Category(name='To Be Updated', description='Desc 2')
    db.session.add_all([cat1, cat2])
    db.session.commit()

    response = client.put(f'/categories/{cat2.id}', json={'name': 'Unique One'})
    assert response.status_code == 409
    assert 'error' in response.json
    assert 'Category name already exists' in response.json['error']

def test_update_category_not_found(client):
    # Test PUT /categories/<id> for a non-existent category.
    response = client.put('/categories/999', json={'name': 'Wont Work'})
    assert response.status_code == 404

def test_delete_category_success(client, db):
    # Test DELETE /categories/<id> successfully deletes a category.
    cat = Category(name='To Delete', description='Gone soon')
    db.session.add(cat)
    db.session.commit()
    category_id = cat.id # Store ID before deletion

    response = client.delete(f'/categories/{category_id}')
    assert response.status_code == 200
    assert 'message' in response.json
    assert f'Category {cat.name} deleted successfully!' in response.json['message']

    # Verify deletion from DB
    deleted_cat = db.session.get(Category, category_id)
    assert deleted_cat is None

def test_delete_category_not_found(client):
    # Test DELETE /categories/<id> for a non-existent category.
    response = client.delete('/categories/999')
    assert response.status_code == 404

# Add tests for User routes if needed, following similar patterns