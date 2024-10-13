from flask import Blueprint, request, jsonify
from models.user import create_user, check_user

auth_blueprint = Blueprint('auth', __name__)

# Register route
@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username and password:
        create_user(username, password)
        return jsonify({"message": "User registered successfully"}), 201
    return jsonify({"error": "Invalid data"}), 400

# Login route
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if check_user(username, password):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401
