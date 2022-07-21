from os.path import basename

from flask import Blueprint
from flask import render_template

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/read-cert-select2')


@blueprint.route('/')
def index():
    return render_template('read_cert_select2/index.html')
