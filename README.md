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

## User

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}' \
  http://127.0.0.1:5000/add_user
```

```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" http://127.0.0.1:5000/users
```


## Categories

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"name": "Electronics", "description": "Devices and gadgets"}' \
  http://127.0.0.1:5000/categories
```

```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" http://127.0.0.1:5000/categories
```

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"name": "Updated Electronics", "description": "Updated description for electronics"}' \
  http://127.0.0.1:5000/categories/1
```

```bash
curl -X DELETE http://127.0.0.1:5000/categories/1
```

## File

```bash
curl -X POST http://127.0.0.1:5000/upload \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -F "files=@/Users/logan/Downloads/penguin_midjourney.jpg" \
  -F "files=@/Users/logan/Downloads/penguin_midjourney.jpg"
```

## Login

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}' \
  http://127.0.0.1:5000/login
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  http://127.0.0.1:5000/refresh
```