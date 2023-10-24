from flask import Blueprint, jsonify


yufei = Blueprint("yufei", __name__)


@yufei.route("/")
def route_base():
    return jsonify({"message": "Testing Route Successful."}), 200
