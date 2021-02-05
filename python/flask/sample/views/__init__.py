from .authentication_express import blueprint as authentication_express
from .authentication_rest import blueprint as authentication_restpki
from .batch_cades_express import blueprint as batch_cades_express
from .batch_cades_rest import blueprint as batch_cades_rest
from .batch_pades_express import blueprint as \
    batch_pades_signature_express
from .batch_pades_rest import blueprint as \
    batch_pades_signature_restpki
from .cades_server_key_express import blueprint as cades_server_key_express
from .cades_signature_express import blueprint as cades_signature_express
from .cades_signature_rest import blueprint as cades_signature_restpki
from .check_pades_express import blueprint as check_pades_express
from .check_pades_rest import blueprint as check_pades_rest
from .download import blueprint as download
from .home import blueprint as home
from .issue_cert_server_amplia import blueprint as issue_cert_server_amplia
from .issue_cert_user_amplia import blueprint as issue_cert_user_amplia
from .list_cert_jquery import blueprint as list_cert_jquery
from .list_cert_select2 import blueprint as list_cert_select2
from .merge_cades_express import blueprint as merge_cades_express
from .merge_server_files import blueprint as merge_server_files
from .open_cades_express import blueprint as open_cades_express
from .open_pades_express import blueprint as open_pades_express
from .open_pades_rest import blueprint as open_pades_rest
from .pades_server_key_express import blueprint as pades_server_key_express
from .pades_cloud_pwd_express import blueprint as pades_cloud_pwd_express
from .pades_cloud_oauth_express import blueprint as pades_cloud_oauth_express
from .pades_signature_express import blueprint as pades_signature_express
from .pades_signature_rest import blueprint as pades_signature_restpki
from .printer_version_pades_express import blueprint as \
    printer_version_pades_express
from .printer_version_pades_rest import blueprint as printer_version_pades_rest
from .read_cert_jquery import blueprint as read_cert_jquery
from .read_cert_select2 import blueprint as read_cert_select2
from .rsa_web import blueprint as rsa_web
from .timestamp_pdf_express import blueprint as timestamp_pdf_express
from .upload import blueprint as upload
from .xml_nfe_signature_rest import blueprint as xml_nfe_signature_rest
from .xml_signature_rest import blueprint as xml_signature_rest
from .server_files import blueprint as server_files

blueprints = {
    authentication_express,
    authentication_restpki,
    batch_cades_express,
    batch_cades_rest,
    batch_pades_signature_express,
    batch_pades_signature_restpki,
    cades_server_key_express,
    cades_signature_express,
    cades_signature_restpki,
    check_pades_express,
    check_pades_rest,
    download,
    home,
    issue_cert_server_amplia,
    issue_cert_user_amplia,
    list_cert_jquery,
    list_cert_select2,
    merge_cades_express,
    merge_server_files,
    open_cades_express,
    open_pades_express,
    open_pades_rest,
    pades_server_key_express,
    pades_signature_express,
    pades_signature_restpki,
    pades_cloud_pwd_express,
    pades_cloud_oauth_express,
    printer_version_pades_express,
    printer_version_pades_rest,
    read_cert_jquery,
    read_cert_select2,
    rsa_web,
    timestamp_pdf_express,
    upload,
    xml_nfe_signature_rest,
    xml_signature_rest,
    server_files,
}
