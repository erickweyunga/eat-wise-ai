from flask import Blueprint, request, jsonify

bp = Blueprint('main', __name__)

@bp.route("/root", methods=["GET"])
def app_root():
    if request.method == "GET":
        return "Welcome to EATWISE API"