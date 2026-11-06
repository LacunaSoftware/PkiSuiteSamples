from os.path import basename

from flask import Blueprint
from flask import render_template

# Flask 2.2 and later reject blueprint names that contain a dot, because the
# name is prepended to the blueprint's endpoint names. The dots in the module
# name are replaced so that basename() keeps only its last part.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/read-cert-select2')


@blueprint.route('/')
def index():
    return render_template('read_cert_select2/index.html')
