import os

from flask import Flask

from logging.config import dictConfig
from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy

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

@app.route('/')
def hello_world():
    app.logger.info('getting all blog posts...')
    return 'Hello from Flask Backend!'

if __name__ == '__main__':
    app.run(debug=True)