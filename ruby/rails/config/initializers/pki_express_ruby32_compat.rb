# TEMPORARY compatibility shim, not part of the PKI Express integration.
#
# pki_express 1.3.2 and earlier call File.exists?, which Ruby 3.2 removed. Without this alias,
# every PKI Express sample fails with "undefined method 'exists?' for class File" as soon as it
# sets a file path (pdf_to_sign_path=, file_to_sign_path=, pkcs12_path=, add_trusted_root, ...).
# The gem only calls File.exists? at run time, never while it loads, so an initializer is early
# enough. Delete this file once pki_express ships a release that uses File.exist?.
File.singleton_class.send(:alias_method, :exists?, :exist?) unless File.respond_to?(:exists?)
