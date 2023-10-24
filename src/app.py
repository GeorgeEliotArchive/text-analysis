from datetime import datetime
from flask import Flask, render_template, request, session, url_for, redirect
from flask_login import UserMixin, current_user, LoginManager, logout_user
from flask_cors import CORS

from flask_moment import Moment

from .utility import init_log


secret_key = b"UytePO(cDDRerwq3r4t5y6u12i8o9232Ez[!@#$%^&*()_+)"

login_manager = LoginManager()

from ._yufei.routes import yufei
from ._libo.routes import libo


def create_app():
    init_log()
    application = Flask(__name__)
    CORS(application)
    moment = Moment(application)

    application.secret_key = secret_key

    login_manager.init_app(application)

    application.register_blueprint(yufei, url_prefix="/yufei")
    application.register_blueprint(libo, url_prefix="/libo")

    @application.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html", user=current_user), 404

    @application.errorhandler(500)
    def internal_server_error(e):
        return render_template("500.html", user=current_user), 500

    @application.route("/")
    def index():
        return render_template("index.html", user=current_user, current_time=datetime.utcnow())

    return application


@login_manager.user_loader
def load_user(user):
    if not user:
        return None

    # use session to match the current user
    try:
        if session["user"]["email"] == user:
            return session["user"]
    except Exception as ex:
        print(" ! User doesn't not match in session, user_load return None.")
        print(" ! The current session: {}: {}".format(session, ex))
        return None
