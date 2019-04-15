Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root action: :index, controller: :home
  get '/check-express/:rc(/:fwd(/:op))', action: :check_pki_express, controller: :home
  get '/check-rest-token/:rc(/:fwd(/:op))', action: :check_rest_pki_token, controller: :home

  get '/upload/:rc', action: :index, controller: :upload, as: :upload
  post '/upload/:rc', action: :action, controller: :upload

  get '/server-files/:rc/:op', action: :index, controller: :server_files, as: :server_files
  post '/server-files/:rc/:op', action: :action, controller: :server_files

  get '/authentication-rest', action: :index, controller: :authentication_rest, as: :authentication_rest
  post '/authentication-rest', action: :action, controller: :authentication_rest

  get '/pades-signature-rest', action: :index, controller: :pades_signature_rest, as: :pades_signature_rest
  post '/pades-signature-rest', action: :action, controller: :pades_signature_rest

  get '/cades-signature-rest', action: :index, controller: :cades_signature_rest, as: :cades_signature_rest
  post '/cades-signature-rest', action: :action, controller: :cades_signature_rest

  get '/batch-pades-rest', action: :index, controller: :batch_pades_rest, as: :batch_pades_rest
  namespace :api do
    namespace :batch_pades_rest, path: '/batch-pades-rest' do
      post 'start/:id', action: :start
      post 'complete/:token', action: :complete
    end
  end

  get '/batch-cades-rest', action: :index, controller: :batch_cades_rest, as: :batch_cades_rest
  namespace :api do
    namespace :batch_cades_rest, path: '/batch-cades-rest' do
      post '/start/:id', action: :start
      post '/complete/:token', action: :complete
    end
  end

end
