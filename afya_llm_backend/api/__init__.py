##########################################
# External Modules
##########################################

import os
from flask import Flask
from flask_cors import CORS

# blueprints
from api.machine_learning import machine_views
from api import main


def create_app():
    ##########################################
    # Environment Variables
    ##########################################
    client_origin_url = os.environ.get("CLIENT_ORIGIN_URL")
    auth0_audience = os.environ.get("AUTH0_AUDIENCE")
    auth0_domain = os.environ.get("AUTH0_DOMAIN")
    secrete_key = os.environ.get("SECRET_KEY")

    if not (client_origin_url and auth0_audience and auth0_domain):
        raise NameError(
            "The required environment variables are missing. Check .env file."
        )

    ##########################################
    # Flask App Instance
    ##########################################

    app = Flask(__name__, instance_relative_config=True)

    ##########################################
    # Configurations
    ##########################################

    app.secret_key = secrete_key

    ##########################################
    # HTTP Security Headers
    ##########################################

    @app.after_request
    def add_headers(response):
        response.headers["X-XSS-Protection"] = "0"
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        return response

    ##########################################
    # CORS
    ##########################################

    CORS(
        app,
        resources={
            r"/*": {"origins": "*"}
        },
        allow_headers=["Authorization", "Content-Type", "Allow-Credentials", "Access-Control-Allow-Credentials", "credentials"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        max_age=86400,
    )

    ##########################################
    # Blueprint Registration
    ##########################################

    app.register_blueprint(machine_views.bp, url_prefix="/afya")
    app.register_blueprint(main.bp, url_prefix="/api")
    
    return app
