module ApplicationHelper

  def get_web_pki_license
    Rails.configuration.lacuna.dig(:web_pki, :license)
  end

  def get_rest_pki_endpoint
    Rails.configuration.lacuna.dig(:rest_pki, :endpoint)
  end
end
