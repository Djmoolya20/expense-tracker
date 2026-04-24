from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt

from routes.auth_routes import auth_bp
from routes.expense_routes import expense_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(expense_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)