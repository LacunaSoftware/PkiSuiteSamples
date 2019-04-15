class HomeController < ApplicationController

  def index
  end

  def check_pki_express

  end

  def check_rest_pki_token
    rc = params[:rc]
    fwd = params[:fwd]
    op = params[:op]

    access_token = Rails.configuration.x.rest_pki.access_token
    if access_token.nil? or access_token.length == 0
      render 'home/rest-token-not-set'
    else
      unless fwd.nil?
        unless op.nil?
          redirect_to("/#{rc}/#{fwd}-rest/#{op}")
        end
        redirect_to("/#{rc}/#{fwd}-rest")
      end
      redirect_to("/#{rc}-rest")
    end
  end
end
