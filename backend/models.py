from app import db  # Import the db instance from app.py

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)


    def __repr__(self):
        return f'<User {self.username}>'

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), unique=True, nullable=False)


# You can define other models here as needed
# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(100), nullable=False)
#     content = db.Column(db.Text, nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     author = db.relationship('User', backref=db.backref('posts', lazy=True))
#
#     def __repr__(self):
#         return f'<Post {self.title}>'