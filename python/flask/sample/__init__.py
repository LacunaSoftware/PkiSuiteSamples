import os
import sys

from imp import reload
from flask import Flask
from flask_session import Session

from sample.views import blueprints

config = {
    'production': 'sample.config.ProductionConfig',
    'development': 'sample.config.DevelopmentConfig',
    'testing': 'sample.config.TestingConfig',
    'default': 'sample.config.Config'
}

if sys.version_info[0] < 3:
    reload(sys)
    sys.setdefaultencoding('utf-8')


def create_app():
    app = Flask(__name__)

    # Select configuration based on the application environment.
    if app.env not in config:
        raise Exception('The "%s" environment is not supported' % app.env)
    app.config.from_object(config[app.env])

    # Folders location
    app_root_folder = os.path.abspath(os.path.dirname(__file__))
    appdata_folder = os.path.join(app_root_folder, 'app_data')

    if not os.path.exists(appdata_folder):
        os.makedirs(appdata_folder)

    # Add environment configuration
    app.config['APPDATA_FOLDER'] = appdata_folder

    register_blueprints(app)
    register_extensions(app)

    return app


def register_extensions(app):
    """Register Flask extensions."""

    # Flask Session
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SECRET_KEY'] = '?Y\Kj;!X%AcmjF%CF(_k)p8,S<<6uhUJ'
    sess = Session()
    sess.init_app(app)


def register_blueprints(app):
    """Register application's blueprints"""
    for bp in blueprints:
        app.register_blueprint(bp)
