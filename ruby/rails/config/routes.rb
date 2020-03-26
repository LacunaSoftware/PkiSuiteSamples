Rails.application.routes.draw do

  root action: :index, controller: :home

  get '/check-express/:rc(/:fwd(/:op))', action: :check_pki_express, controller: :home
  get '/check-rest-token/:rc(/:fwd(/:op))', action: :check_rest_pki_token, controller: :home

  get '/download/:file_id', action: :get, controller: :download
  get '/download/sample/:sample_id', action: :sample, controller: :download
  get '/download/doc/:id', action: :doc, controller: :download

  get '/upload/:rc', action: :index, controller: :upload, as: :upload
  post '/upload/:rc', action: :action, controller: :upload

  get '/server-files/:rc/:op', action: :index, controller: :server_files, as: :server_files
  post '/server-files/:rc/:op', action: :action, controller: :server_files
  
  get '/list-cert-jquery/', action: :index, controller: :list_cert_jquery
  get '/list-cert-select2/', action: :index, controller: :list_cert_select2
  
  get '/read-cert-jquery/', action: :index, controller: :read_cert_jquery
  get '/read-cert-select2/', action: :index, controller: :read_cert_select2
  get '/rsa-web/', action: :index, controller: :rsa_web

  get '/pades-signature-rest/:file_id', action: :index, controller: :pades_signature_rest, as: :pades_signature_rest
  post '/pades-signature-rest/:file_id', action: :action, controller: :pades_signature_rest

  get '/batch-pades-rest/', action: :index, controller: :batch_pades_rest, as: :batch_pades_rest
  post '/batch-pades-rest/start/', action: :start, controller: :batch_pades_rest
  post '/batch-pades-rest/complete/', action: :complete, controller: :batch_pades_rest

  get '/cades-signature-rest/:file_id', action: :index, controller: :cades_signature_rest, as: :cades_signature_rest
  get '/cades-signature-rest/cosign/:cmsfile', action: :index, controller: :cades_signature_rest, as: :cades_cosignature_rest
  post '/cades-signature-rest/', action: :action, controller: :cades_signature_rest, as: :cades_signature_post_rest

  get '/xml-signature-rest/', action: :index, controller: :xml_signature_rest, as: :xml_signature_rest
  post '/xml-signature-rest/', action: :action, controller: :xml_signature_rest

  get '/xml-nfe-signature-rest/', action: :index, controller: :xml_nfe_signature_rest, as: :xml_nfe_signature_rest
  post '/xml-nfe-signature-rest/', action: :action, controller: :xml_nfe_signature_rest

  get '/authentication-rest/', action: :index, controller: :authentication_rest, as: :authentication_rest
  post '/authentication-rest/', action: :action, controller: :authentication_rest

  get '/pades-signature-express/:file_id', action: :index, controller: :pades_signature_express, as: :pades_signature_express
  post '/pades-signature-express/start/:file_id', action: :start, controller: :pades_signature_express
  post '/pades-signature-express/complete/:file_id', action: :complete, controller: :pades_signature_express
end
