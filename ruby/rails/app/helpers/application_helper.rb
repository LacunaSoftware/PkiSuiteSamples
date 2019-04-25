module ApplicationHelper

  def get_web_pki_license
    Rails.configuration.lacuna['web_pki']['license']
  end

  def get_rest_pki_endpoint
    Rails.configuration.lacuna['rest_pki']['endpoint']
  end
end
