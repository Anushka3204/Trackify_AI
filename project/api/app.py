from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import datetime
import jwt
import bcrypt
from functools import wraps
from flask_mail import Mail, Message
import random
import string

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'anushka3204@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'cfzh zrov aaga dyfc'  # Replace with your app password

# Enable debug mode
app.debug = True

# Initialize Flask-Mail
mail = Mail(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["taskmanager"]
tasks_collection = db["tasks"]
users_collection = db["users"]
otp_collection = db["otps"]

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({"_id": ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@app.before_request
def before_request():
    print(f"Incoming request: {request.method} {request.path}")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

# User registration
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "Email already exists"}), 400
    
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "created_at": datetime.datetime.utcnow()
    }
    result = users_collection.insert_one(user)
    user['_id'] = str(result.inserted_id)
    del user['password']
    return jsonify(user), 201

# User login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data['email']})
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        }
    })

# Get all tasks for a user
@app.route('/api/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = list(tasks_collection.find({"user_id": str(current_user['_id'])}))
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks)

# Get single task
@app.route('/api/tasks/<task_id>', methods=['GET'])
@token_required
def get_task(current_user, task_id):
    try:
        task = tasks_collection.find_one({
            "_id": ObjectId(task_id),
            "user_id": str(current_user['_id'])
        })
        if task:
            task['_id'] = str(task['_id'])
            return jsonify(task)
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid task ID"}), 400

# Update task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    try:
        data = request.json
        updated_task = {
            "title": data.get("title"),
            "description": data.get("description"),
            "completed": data.get("completed", False),
            "user_id": str(current_user['_id'])
        }
        result = tasks_collection.update_one(
            {"_id": ObjectId(task_id), "user_id": str(current_user['_id'])},
            {"$set": updated_task}
        )
        if result.matched_count == 1:
            updated_task["_id"] = task_id
            return jsonify(updated_task)
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid task ID"}), 400

# Delete task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    try:
        result = tasks_collection.delete_one({
            "_id": ObjectId(task_id),
            "user_id": str(current_user['_id'])
        })
        if result.deleted_count == 1:
            return jsonify({"message": "Task deleted"})
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid task ID"}), 400

# Create task
@app.route('/api/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    try:
        data = request.json
        task = {
            "title": data.get("title"),
            "description": data.get("description"),
            "completed": False,
            "created_at": datetime.datetime.utcnow(),
            "user_id": str(current_user['_id'])
        }
        result = tasks_collection.insert_one(task)
        task['_id'] = str(result.inserted_id)
        return jsonify(task), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Generate OTP
@app.route('/api/generate-otp', methods=['POST'])
def generate_otp():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    # Check if email exists in the database
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "Email not registered"}), 404
    
    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Store OTP in database with expiration (5 minutes)
    otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "created_at": datetime.datetime.utcnow(),
        "expires_at": datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    })
    
    # Send OTP via email
    msg = Message('Your Trackify Login OTP', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Your OTP for Trackify login is: {otp}. This OTP will expire in 5 minutes.'
    
    try:
        mail.send(msg)
        return jsonify({"message": "OTP sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to send OTP"}), 500

# Verify OTP
@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400
    
    # Find the most recent OTP for this email
    stored_otp = otp_collection.find_one({
        "email": email,
        "otp": otp,
        "expires_at": {"$gt": datetime.datetime.utcnow()}
    })
    
    if not stored_otp:
        return jsonify({"error": "Invalid or expired OTP"}), 401
    
    # Delete the used OTP
    otp_collection.delete_one({"_id": stored_otp["_id"]})
    
    # Get user and generate token
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        }
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
