Rails.application.routes.draw do

  root action: :index, controller: :home, as: :home

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

  get '/open-pades-rest/:file_id', action: :index, controller: :open_pades_rest, as: :open_pades_rest

  get '/printer-version-pades-rest/:file_id', action: :index, controller: :printer_version_pades_rest, as: :printer_version_pades_rest
  get '/printer-version-pades-rest/download/:file_id', action: :download, controller: :printer_version_pades_rest, as: :download_printer_version_pades_rest
  get '/check-pades-rest/:code', action: :index, controller: :check_pades_rest, as: :check_pades_rest
  
  get '/pades-signature-rest/:file_id', action: :index, controller: :pades_signature_rest, as: :pades_signature_rest
  post '/pades-signature-rest/:file_id', action: :action, controller: :pades_signature_rest

  get '/pades-server-key-express/:file_id', action: :index, controller: :pades_server_key_express

  get '/receita-simples-express/', action: :index, controller: :receita_simples_express, as: :receita_simples_express
  post '/receita-simples-express/generate/', action: :generate, controller: :receita_simples_express
  post '/receita-simples-express/start/:file_id', action: :start, controller: :receita_simples_express
  post '/receita-simples-express/complete/:file_id', action: :complete, controller: :receita_simples_express

  get '/batch-pades-rest/', action: :index, controller: :batch_pades_rest, as: :batch_pades_rest
  post '/batch-pades-rest/start/', action: :start, controller: :batch_pades_rest
  post '/batch-pades-rest/complete/', action: :complete, controller: :batch_pades_rest

  get '/cades-signature-rest/:file_id', action: :index, controller: :cades_signature_rest, as: :cades_signature_rest
  get '/cades-signature-rest/cosign/:cmsfile', action: :index, controller: :cades_signature_rest, as: :cades_cosignature_rest
  post '/cades-signature-rest/', action: :action, controller: :cades_signature_rest, as: :cades_signature_post_rest

  get '/batch-cades-rest/', action: :index, controller: :batch_cades_rest, as: :batch_cades_rest
  post '/batch-cades-rest/start/', action: :start, controller: :batch_cades_rest
  post '/batch-cades-rest/complete/', action: :complete, controller: :batch_cades_rest

  get '/xml-signature-rest/', action: :index, controller: :xml_signature_rest, as: :xml_signature_rest
  post '/xml-signature-rest/', action: :action, controller: :xml_signature_rest

  get '/xml-nfe-signature-rest/', action: :index, controller: :xml_nfe_signature_rest, as: :xml_nfe_signature_rest
  post '/xml-nfe-signature-rest/', action: :action, controller: :xml_nfe_signature_rest

  get '/authentication-rest/', action: :index, controller: :authentication_rest, as: :authentication_rest
  post '/authentication-rest/', action: :action, controller: :authentication_rest

  get '/pades-signature-express/:file_id', action: :index, controller: :pades_signature_express, as: :pades_signature_express
  post '/pades-signature-express/start/:file_id', action: :start, controller: :pades_signature_express
  post '/pades-signature-express/complete/:file_id', action: :complete, controller: :pades_signature_express

  get '/batch-pades-express/', action: :index, controller: :batch_pades_express, as: :batch_pades_express
  post '/batch-pades-express/start/', action: :start, controller: :batch_pades_express
  post '/batch-pades-express/complete/', action: :complete, controller: :batch_pades_express

  get '/cades-signature-express/:file_id', action: :index, controller: :cades_signature_express, as: :cades_signature_express
  post '/cades-signature-express/start/:file_id', action: :start, controller: :cades_signature_express, as: :cades_signature_start_express
  post '/cades-signature-express/complete/:file_id', action: :complete, controller: :cades_signature_express, as: :cades_signature_complete_express

  get '/batch-cades-express/', action: :index, controller: :batch_cades_express, as: :batch_cades_express
  post '/batch-cades-express/start/', action: :start, controller: :batch_cades_express
  post '/batch-cades-express/complete/', action: :complete, controller: :batch_cades_express
end
