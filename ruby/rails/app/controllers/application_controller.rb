class ApplicationController < ActionController::Base
  include Util
  include StorageMock
  # Protect against CSRF attacks. With :null_session, a request without a valid
  # CSRF token runs with an empty session instead of raising an exception.
  protect_from_forgery with: :null_session

end
