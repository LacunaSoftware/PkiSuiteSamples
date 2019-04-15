module ApplicationHelper

  def get_web_pki_license
    Rails.configuration.x.web_pki[:license]
  end

  def get_rest_pki_endpoint
    Rails.configuration.x.rest_pki[:endpoint]
  end
end
