# File Name: _libo/routes.py
# Created: Oct 22, 2023


from threading import Timer, Thread
from flask import Blueprint, jsonify, Response, render_template_string, render_template


libo = Blueprint("libo", __name__)

from .models import read_xml_file


@libo.route("/")
def route_base():
    return jsonify({"message": "Testing Route Successful."}), 200


@libo.route("/display/get-xml/<file_name>")
def route_xml(file_name):
    xml_data = read_xml_file(file_name)
    if xml_data:
        return Response(xml_data, mimetype="text/xml")
    else:
        return jsonify({"message": "Error reading XML file."}), 500


@libo.route("/display/<file_name>")
def display_xml(file_name):
    return render_template("_libo/display_xml.html", filename=file_name)


@libo.route("/text/")
def route_display_text():
    return render_template("_libo/text_display.html")


@libo.route("/text/get-xml/<file_name>")
def route_display_xml_file(file_name):
    xml_data = read_xml_file(file_name)
    if xml_data:
        return Response(xml_data, mimetype="text/xml")
    else:
        return jsonify({"message": "Error reading XML file."}), 500
