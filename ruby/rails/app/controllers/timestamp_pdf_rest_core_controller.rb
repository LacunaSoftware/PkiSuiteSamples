require 'base64'

class TimestampPdfRestCoreController < ApplicationController

  # The timestamp tier determines which timestamp authority issues the
  # timestamp. The API takes a tier's ID or name. This sample uses the Lacuna
  # Test tier (for development purposes only!), which the samples' trial API
  # key can use. In production, use the PKI Brazil tier
  # ("a402df41-8559-47b2-a05c-be555bf66310", the tier of the "Timestamp a PDF"
  # Demo) or your account's own tier, which needs an API key with access to it.
  TIMESTAMP_TIER = '9e5b9ccd-1916-49e7-bb99-9eb259ab00f8' # Lacuna Test

  # GET /timestamp-pdf-rest-core/:file_id
  #
  # This action adds a document timestamp to a PDF using REST PKI Core and
  # renders a page with a link to download the timestamped PDF. It is a
  # server-only operation: no signature is made and Web PKI is not involved.
  # The user reaches it after uploading a PDF on the upload page, which
  # redirects here passing the file's id.
  def index

    # Retrieve "file_id" parameter.
    file_id = params[:file_id]

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample can only be executed if the provided file exists.
    unless exist?(file_id)
      render plain: 'Not Found', status: 404
      return
    end

    # Build the request to stamp the PDF. Its fields follow the
    # StampPdfRequest model of the REST PKI Core API (see
    # https://core.pki.rest/swagger). Binary fields are Base64-encoded.
    request = {

      # The PDF to be timestamped.
      file: {
        content: Base64.strict_encode64(File.binread(get_data_path(file_id))),
        contentType: 'application/pdf',
        name: retrieve_filename(file_id)
      },

      # The timestamp tier (see TIMESTAMP_TIER above).
      timestampTier: TIMESTAMP_TIER
    }

    # Call REST PKI Core to add the document timestamp (see util.rb and
    # rest_pki_core_client.rb). The response is a StampPdfResponse.
    client = get_rest_pki_core_client
    response = client.stamp_pdf(request)

    # At this point, you'd typically store the timestamped PDF on your
    # database. REST PKI Core returns it on the "file" field, either inline
    # ("content", Base64-encoded) or as a temporary link ("url"). For
    # demonstration purposes, we'll store it with our StorageMock class.
    stamped_file = response['file']
    if stamped_file['content'].nil?
      stamped_content = client.download(stamped_file['url'])
    else
      stamped_content = Base64.decode64(stamped_file['content'])
    end
    @stamped_pdf = store(stamped_content, 'pdf', retrieve_filename(file_id))
  end
end
