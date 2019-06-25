from os.path import basename

from flask import Blueprint
from flask import render_template

blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/read-cert-select2')


@blueprint.route('/')
def index():
    return render_template('read_cert_select2/index.html')
