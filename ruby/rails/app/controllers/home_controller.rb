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
    rescue PkiExpress::InstallationNotFoundError
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

    access_token = Rails.configuration.lacuna['rest_pki']['access_token']
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
end
