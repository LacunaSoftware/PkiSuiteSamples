require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
# require "active_record/railtie"
# require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SuiteSamples
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified
    # here. Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # --------------------------------------------------------------------------
    # Lacuna Configuration
    # --------------------------------------------------------------------------

    # Trust in Lacuna Test PKI (for development purposes only!)
    config.x.trust_lacuna_test_root = true
    # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!

    # REST PKI parameters
    # -------------------

    # ======================================================
    #       >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ======================================================
    config.x.rest_pki.access_token = '9nusF9Wh-lTYsVRbhkgjYwMqrz6nfZQzrJmcU8nQMapctnql8GUh4KA56YCnm_Ff-VKelhD3tE9zXfUzKOn1yL3h3h7uz-Vq0Eu2sb9rl393Vd53LuP5Hoza7cOlCMMJa598yu-bc9zPwU_sH81sn6T-vKSpBjdvXM16rk--im3RTA5brTHy1ggCO_oavmVUqn1zb6H6St13M8B0FdflSNxeRD6ThcABKeDFQhKqrgAGGLZrsoZDXh-hleatUzMp0kALb_f9VKVDwt4QGEoMS14bT4hbU9hY4kaGdaHsAE8Zio6Ja5LSIIKIkqIID-i-5vEg4R9cjrZ7tFaM5MwKVlvETRDqHUlK30HjzA4ngLwSSRYKtKYFFa1PRBJ9l6aU7J9MUlxogk1URxV0oveC83bI_oWVvB1Wzd1gUFPGpHILINNRkzfafabl5V--zReEoF-wDbo6KewBBU9nF6-UaFEGK-3ZkQ2Fa8K9KYMJGrW7ylTwPIpojBWBHzlyXO5X-jjF-A'
    # This is a TRIAL token. It will be expired at 30/05/2019. If the REST PKI
    # sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises" installation of
    # REST PKI, fill the field below with the URL address of your REST PKI
    # installation (with the trailing '/' character).
    config.x.rest_pki.endpoint = nil

    # PKI Express parameters
    # ----------------------

    # List of custom trusted roots. In this sample, we will get the certificate
    # files on resources/static folder.
    config.x.pki_express.trusted = [],

    # Offline mode. Set this, if you want to PKI Express to run on offline mode.
    # This mode is useful when there is no network available.
    config.x.pki_express.offline = false

    # Web PKI parameters
    # ------------------

    # Base64-encoded binary license for the Web PKI. This value is passed to
    # Web PKI component's constructor on JavaScript.
    config.x.web_pki.license = nil
  end
end
