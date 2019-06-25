from os.path import basename

from flask import Blueprint
from flask import render_template

blueprint = Blueprint(basename(__name__), __name__, url_prefix='/rsa-web')


@blueprint.route('/')
def index():
    return render_template('rsa_web/index.html')
