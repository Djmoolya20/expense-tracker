from flask import Blueprint, request, jsonify
from extensions import db
from models.user_model import User
from flask_jwt_extended import create_access_token
from utils.security import hash_password, verify_password

from sqlalchemy.exc import IntegrityError
auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    try:
        user = User(
            username=data['username'],
            password=hash_password(data['password'])
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "User created"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Username already exists"}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()

    if user and verify_password(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token)

    return jsonify({"msg": "Invalid credentials"}), 401