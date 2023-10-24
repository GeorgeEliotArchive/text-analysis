from threading import Timer, Thread
from flask import Blueprint, jsonify


libo = Blueprint("libo", __name__)


@libo.route("/")
def route_base():
    return jsonify({"message": "Testing Route Successful."}), 200
