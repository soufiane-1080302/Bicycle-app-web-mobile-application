from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
       app = Flask(__name__)
       app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///weather.db'
       app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
       db.init_app(app)

       # Voeg verfijnde CORS-instellingen toe
       CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

       from .routes import main
       app.register_blueprint(main)

       return app