require 'json'
require 'net/http'
require 'uri'

# Calls the REST PKI Core API for the REST PKI Core samples.
#
# Lacuna Software does not publish a REST PKI Core client library for Ruby, so
# this class calls the API directly with Net::HTTP. It only implements the
# calls made by these samples. The request and response bodies are the JSON
# models documented on https://core.pki.rest/swagger, as Ruby hashes.
class RestPkiCoreClient

  def initialize(endpoint, api_key)
    @endpoint = endpoint
    @api_key = api_key
  end

  # POST api/signature
  #
  # Prepares a signature. Receives a PrepareSignatureRequest and returns a
  # PrepareSignatureResponse.
  def prepare_signature(request)
    post('api/signature', request)
  end

  # POST api/signature/completion
  #
  # Completes a signature. Receives a CompleteSignatureRequestV2 and returns a
  # DocumentModel.
  def complete_signature(request)
    post('api/signature/completion', request)
  end

  # Downloads a file from a link returned by REST PKI Core, such as the "url"
  # of the "signedFile" of a DocumentModel. These links carry their own access
  # ticket, so the API key is not sent.
  def download(url)
    send_request(Net::HTTP::Get.new(URI(url))).body
  end

  private

  def post(path, body)
    request = Net::HTTP::Post.new(URI.join(@endpoint, path))
    # The API key is sent on the X-Api-Key header of every API call.
    request['X-Api-Key'] = @api_key
    request['Content-Type'] = 'application/json'
    request.body = body.to_json
    JSON.parse(send_request(request).body)
  end

  def send_request(request)
    uri = request.uri
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end
    return response if response.is_a?(Net::HTTPSuccess)

    # On HTTP 422, the body is an ErrorModelV2 with an error code and message.
    message = "REST PKI Core returned HTTP #{response.code} on #{request.method} #{uri.path}"
    begin
      error = JSON.parse(response.body)
      details = [error['code'], error['message']].compact.join(' ')
      message += ": #{details}" unless details.empty?
    rescue JSON::ParserError, TypeError, NoMethodError
      # The body is not JSON (for instance, on HTTP 401).
    end
    raise message
  end
end
