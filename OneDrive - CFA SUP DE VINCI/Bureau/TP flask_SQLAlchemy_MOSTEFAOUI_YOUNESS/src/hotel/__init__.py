from flask import Flask
from flask_migrate import Migrate
from .models import *
from .database import db
from .routes import main

migrate = Migrate()

def create_app():
  app = Flask(__name__)

  app.register_blueprint(main)

  if __name__ == "__main__":
    app.run(debug=True)

  app.config['SECRET_KEY'] = 'mysecretkey'
  # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@domaine:port/database'
  # exemple en dessous 
  app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass@db/hotel'
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


  db.init_app(app)
  # Creation de la base de donnÃ©es
  with app.app_context():
    db.create_all()

  migrate.init_app(app, db)
  
  return app
