require 'pki_express'

class HomeController < ApplicationController
  def index; end

  def check_pki_express
    rc = params[:rc]
    fwd = params[:fwd]
    op = params[:op]

    begin
      auth = PkiExpress::Authentication.new
      auth.start
    # On Linux, the pki_express gem raises a plain CommandError (not InstallationNotFoundError)
    # when the pkie command is not found.
    rescue PkiExpress::InstallationNotFoundError, PkiExpress::CommandError
      render 'home/express-installation-not-found'
      return
    end

    if fwd.nil?
      redirect_to "/#{rc}-express"
    elsif op.nil?
      redirect_to "/#{rc}/#{fwd}-express"
    else
      redirect_to "/#{rc}/#{fwd}-express/#{op}"
    end
  end

  def check_rest_pki_token
    rc = params[:rc]
    fwd = params[:fwd]
    op = params[:op]

    access_token = Rails.configuration.lacuna.dig(:rest_pki, :access_token)
    if access_token.nil? or access_token.length == 0
      render 'home/rest-token-not-set'
      return
    end

    if fwd.nil?
      redirect_to "/#{rc}-rest"
    else
      if op.nil?
        redirect_to "/#{rc}/#{fwd}-rest"
      else
        redirect_to "/#{rc}/#{fwd}-rest/#{op}"
      end
    end
  end

  def check_rest_pki_core_api_key
    rc = params[:rc]
    fwd = params[:fwd]
    op = params[:op]

    api_key = Rails.configuration.lacuna.dig(:rest_pki_core, :api_key)
    if api_key.nil? or api_key.length == 0
      render 'home/rest-core-api-key-not-set'
      return
    end

    if fwd.nil?
      redirect_to "/#{rc}-rest-core"
    elsif op.nil?
      redirect_to "/#{rc}/#{fwd}-rest-core"
    else
      redirect_to "/#{rc}/#{fwd}-rest-core/#{op}"
    end
  end
end
