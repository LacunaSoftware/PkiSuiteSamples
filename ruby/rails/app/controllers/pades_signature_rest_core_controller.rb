require 'base64'

class PadesSignatureRestCoreController < ApplicationController

  # GET /pades-signature-rest-core
  #
  # This action simply renders the page.
  def index

    # Retrieve "file_id" parameter.
    @file_to_sign = params[:file_id]

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample can only be executed if the provided file exists.
    render plain: 'Not Found', status: 404 unless exist?(@file_to_sign)
  end

  # POST /pades-signature-rest-core/start
  #
  # This action receives the form submission from the signature page, after Web
  # PKI has read the chosen certificate (see method startSignature() on
  # signature-start-form.js). It asks REST PKI Core to prepare the signature
  # and renders a page that signs the resulting hash with Web PKI.
  def start

    # Retrieve parameters
    @file_to_sign = params[:file_id]
    @cert_thumb = params[:cert_thumb]
    cert_content = params[:cert_content]

    # Verify if the :file_id exists with the help of our StorageMock class.
    unless exist?(@file_to_sign)
      render plain: 'Not Found', status: 404
      return
    end

    # Build the request to prepare the signature. Its fields follow the
    # PrepareSignatureRequest model of the REST PKI Core API (see
    # https://core.pki.rest/swagger). Binary fields are Base64-encoded.
    request = {

      # The PDF to be signed.
      file: {
        content: Base64.strict_encode64(File.binread(get_data_path(@file_to_sign))),
        contentType: 'application/pdf',
        name: retrieve_filename(@file_to_sign)
      },

      # The signer's certificate, as read by Web PKI on the previous page
      # (already Base64-encoded).
      certificate: {
        content: cert_content
      },

      signatureType: 'Pdf',

      # The security context determines which root certification authorities
      # are trusted when REST PKI Core validates the signer's certificate (see
      # util.rb).
      securityContextId: get_security_context_id,

      pdfSignatureOptions: {
        visualRepresentation: {
          text: {
            # For a full list of the supported tags, see:
            # https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
            text: 'Signed by {{name}} ({{national_id}})',
            fontSize: 13.0,
            # Specify that the signing time should also be rendered.
            includeSigningTime: true,
            # Optionally set the horizontal alignment of the text ('Left' or
            # 'Right'), if not set the default is Left.
            horizontalAlign: 'Left',
            # Optionally set the container within the signature rectangle on
            # which to place the text. By default, the text can occupy the
            # entire rectangle.
            container: {
              left: 0.2,
              top: 0.2,
              right: 0.2,
              bottom: 0.2
            }
          },
          image: {
            # We'll use as background the image private/stamp.png.
            resource: {
              content: Base64.strict_encode64(get_pdf_stamp_content),
              mimeType: 'image/png'
            },
            # Align the image to the right.
            horizontalAlign: 'Right',
            # Align the image to the center.
            verticalAlign: 'Center'
          },
          # Position the signatures side by side at the bottom of the last
          # page. These are the values of REST PKI Core's "footnote" preset,
          # with a larger rectangle to fit the background image.
          position: {
            pageNumber: -1,
            measurementUnits: 'Centimeters',
            auto: {
              container: {
                left: 1.0,
                right: 1.0,
                bottom: 1.0,
                height: 4.94
              },
              signatureRectangleSize: {
                width: 8.0,
                height: 4.94
              },
              rowSpacing: 0.3
            }
          }
        }
      }
    }

    # Call REST PKI Core to prepare the signature (see util.rb and
    # rest_pki_core_client.rb).
    response = get_rest_pki_core_client.prepare_signature(request)

    # REST PKI Core validates the signer's certificate before preparing the
    # signature. If the certificate is not valid or not trusted, "success" is
    # false and "validationResults" says why.
    unless response['success']
      details = ''
      errors = response.dig('validationResults', 'errors')
      unless errors.nil? or errors.empty?
        details = ': ' + errors.map { |item| item['message'] }.join('; ')
      end
      raise "The signature could not be prepared (#{response['failure']})#{details}"
    end

    # Render the fields below as hidden fields, to be used on the javascript or
    # on the "complete" step:
    # - to_sign_hash: the hash to be signed by Web PKI, Base64-encoded.
    # - digest_algorithm: the OID of the digest algorithm, which Web PKI needs
    #   to sign the hash.
    # - state: data that REST PKI Core needs to complete the signature, which
    #   we pass back to it on the "complete" step.
    @to_sign_hash = response['toSign']['hash']
    @digest_algorithm = response['toSign']['signatureAlgorithm']['digestAlgorithmOid']
    @state = response['state']
  end

  # POST /pades-signature-rest-core/complete
  #
  # This action receives the form submission after Web PKI signs the hash (see
  # method sign() on signature-complete-form.js). It asks REST PKI Core to
  # complete the signature.
  def complete
    state = params[:state]
    signature = params[:signature]

    # Call REST PKI Core to complete the signature, passing the state returned
    # on the "start" step and the signature value computed by Web PKI. The
    # request follows the CompleteSignatureRequestV2 model and the response is
    # a DocumentModel.
    client = get_rest_pki_core_client
    document = client.complete_signature(state: state, signature: signature)

    # At this point, you'd typically store the signed PDF on your database. The
    # "signedFile" field holds a temporary link to it. For demonstration
    # purposes, we'll download the signed PDF and store it with our
    # StorageMock class.
    signed_file = document['signedFile']
    @signed_pdf = store(client.download(signed_file['location']), 'pdf', signed_file['name'])
  end
end
