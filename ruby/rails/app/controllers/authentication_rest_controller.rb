require 'rest_pki'

class AuthenticationRestController < ApplicationController
  # GET /authentication-rest
  #
  # This route initiates a certificate authentication using REST PKI and renders
  # the authentication page.
  def index
    # Get an instance of the Authentication class (util.rb).
    auth = RestPki::Authentication.new(get_rest_pki_client)
  
    # Call the start_with_webpki() method, which initiates the authentication.
    # This yields the "token", a 22-character case-sensitive URL-safe string,
    # which represents this authentication process. We'll use this value to call
    # the signWithRestPki() method on the Web PKI component
    # (see app/assets/javascripts/signature-form.js) and also call the
    # complete_with_webpki() method on the action below. This should not be
    # mistaken for the API access token. We have encapsulated the security
    # context choice on util.rb.
    @token = auth.start_with_webpki(get_security_context_id)
  
    # The token acquired can only be used for a single authentication.
    # In order to retry authenticating it is necessary to get a new token.
    # This can be a problem if the user uses the back button of the
    # browser, since the browser might show a cached page that we rendered
    # previously, with a now stale token. To prevent this from happening,
    # we call the method set_expired_page_headers, located in util.rb, which
    # sets HTTP headers to prevent caching of the page.
    set_expired_page_headers
  end

  # POST /authentication-rest
  #
  # This route receives the form submission from the view 'authentication_rest'. We'll
  # call REST PKI to complete the authentication.
  def action
    # Get the token for this authentication (rendered in a hidden input field, see
    # authentication_rest/index.html.erb).
    token = params[:token]

    # Get an instance of the Authentication class (util.rb).
    auth = RestPki::Authentication.new(get_rest_pki_client)

    # Call the complete_with_webpki() method with the token, which finalizes the
    # authentication process. The call yields a ValidationResults which denotes
    # whether the authentication succeeded or not.
    @result = auth.complete_with_webpki(token)

    # Check the authentication result.
    if @result.is_valid
      # The certificate is valid according to the security context you selected
      # when starting the authentication and the user is indeed the
      # certificate's subject. Now, you'd typically query your database for a
      # user that matches one of the certificate's fields, such as its email
      # address or its ICP-Brasil CPF (the actual field to be used as key
      # depends on your application's business logic) and store that user's ID
      # on the session, signing the user in.
      @user_cert = auth.certificate_info
    else
      # If the authentication was not successful, we render a page showing
      # what went wrong.
      @vr_html = @result
    end
  end
end