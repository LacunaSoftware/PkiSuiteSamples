from .authentication_express import blueprint as authentication_express
from .authentication_restpki import blueprint as authentication_restpki
from .batch_pades_signature_express import blueprint as \
    batch_pades_signature_express
from .batch_pades_signature_restpki import blueprint as \
    batch_pades_signature_restpki
from .cades_signature_express import blueprint as cades_signature_express
from .cades_signature_restpki import blueprint as cades_signature_restpki
from .check_pades_express import blueprint as check_pades_express
from .download import blueprint as download
from .home import blueprint as home
from .open_pades_express import blueprint as open_pades_express
from .pades_signature_express import blueprint as pades_signature_express
from .pades_signature_restpki import blueprint as pades_signature_restpki
from .printer_version_pades_express import blueprint as \
    printer_version_pades_express
from .upload import blueprint as upload

blueprints = {
    authentication_express,
    authentication_restpki,
    batch_pades_signature_express,
    batch_pades_signature_restpki,
    cades_signature_express,
    cades_signature_restpki,
    check_pades_express,
    download,
    home,
    open_pades_express,
    pades_signature_express,
    pades_signature_restpki,
    printer_version_pades_express,
    upload,
}
