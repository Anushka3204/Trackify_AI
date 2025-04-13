from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Enable debug mode
app.debug = True

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["taskmanager"]
tasks_collection = db["tasks"]

@app.before_request
def before_request():
    print(f"Incoming request: {request.method} {request.path}")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = list(tasks_collection.find())
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks)

# Get single task
@app.route('/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    try:
        print(f"Getting task with ID: {task_id}")
        task = tasks_collection.find_one({"_id": ObjectId(task_id)})
        if task:
            task['_id'] = str(task['_id'])
            print(f"Found task: {task}")
            return jsonify(task)
        print("Task not found")
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        print(f"Error getting task: {str(e)}")
        return jsonify({"error": "Invalid task ID"}), 400

# Update task
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        updated_task = {
            "title": data.get("title"),
            "description": data.get("description"),
            "completed": data.get("completed", False)
        }
        result = tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": updated_task}
        )
        if result.matched_count == 1:
            updated_task["_id"] = task_id
            return jsonify(updated_task)
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        print(f"Error updating task: {str(e)}")
        return jsonify({"error": "Invalid task ID"}), 400

# Delete task
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Task deleted"})
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        print(f"Error deleting task: {str(e)}")
        return jsonify({"error": "Invalid task ID"}), 400

# Create task
@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        task = {
            "title": data.get("title"),
            "description": data.get("description"),
            "completed": False,
            "created_at": datetime.datetime.utcnow()
        }
        result = tasks_collection.insert_one(task)
        task['_id'] = str(result.inserted_id)
        return jsonify(task), 201
    except Exception as e:
        print(f"Error creating task: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
