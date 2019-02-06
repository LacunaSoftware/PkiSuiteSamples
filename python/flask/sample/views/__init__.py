from .authentication_restpki import blueprint as authentication_restpki
from .batch_pades_signature_express import blueprint as batch_pades_signature_express
from .batch_pades_signature_restpki import blueprint as batch_pades_signature_restpki
from .cades_signature_express import blueprint as cades_signature_express
from .cades_signature_restpki import blueprint as cades_signature_restpki
from .download import blueprint as download
from .home import blueprint as home
from .pades_signature_express import blueprint as pades_signature_express
from .pades_signature_restpki import blueprint as pades_signature_restpki
from .upload import blueprint as upload

blueprints = {
    authentication_restpki,
    batch_pades_signature_express,
    batch_pades_signature_restpki,
    cades_signature_express,
    cades_signature_restpki,
    download,
    home,
    pades_signature_express,
    pades_signature_restpki,
    upload,
}