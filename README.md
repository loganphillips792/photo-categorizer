# photo-categorizer

# Frontend

1. cd frontend/frontend
2. npm install
3. npm run dev

## Run Prettier

npm run format

## Run Es Lint

npm run lint

# Backend

## Without Docker

### Installing Python dependencies

1. ```python3 -m venv ~/Desktop/PhotoCategorizer```
2. ```source ~/Desktop/PhotoCategorizer/bin/activate``` - this line activates the virtual environment so your Python will use an packages that are installed in it
3. ```which pip``` to verify what is being used (Should point to the one from the virtual environment)
4. ```~/Desktop/PhotoCategorizer/bin/python3 -m pip install --upgrade pip```
5. ```pip install -r backend/requirements.txt```

### Running the application

1. cd backend
2. Create .env file based off of .env.example
3. python db/__init__db.py
4. flask run

## With Docker

cd backend
docker build -t flask-app -f ./build/Dockerfile .
docker run -d -p 5001:5000 --env-file .env --name backend-container-2 flask-app

# Frontend routes

- /
- /create-blog-post
- /all-blog-posts
- /blog/:blogPostId
- /login
- /admin (protected route)
- not found

# API Commands

```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}' \
  http://127.0.0.1:5000/add_user
```

```
curl http://127.0.0.1:5000/users
```