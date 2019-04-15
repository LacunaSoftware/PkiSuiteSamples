module PadesVisualElementsRest
  include ActiveSupport::Concern

  # This function contains examples of signature visual representation positions. This code is only in a separate
  # function in order to organize the various examples, you can pick the one that best suits your needs and use it
  # below directly without an encapsulating function.
  def get_visual_representation
      # Example #6: custom auto positioning
      #
      {
          text: {

              # The tags {{name}} and {{national_id}} will be substituted according to the user's certificate
              #
              # name        : full name of the signer
              # national_id : if the certificate is ICP-Brasil, contains the signer's CPF
              #
              # For a full list of the supported tags, see: https://github.com/LacunaSoftware/RestPkiSamples/blob/master/PadesTags.md
              text: 'Signed by {{signerName}} ({{signerNationalId}})',
              # Specify that the signing time should also be rendered
              horizontalAlign: 'Left',
              # Optionally set the horizontal alignment of the text ('Left' or 'Right'), if not set the default is
              # Left
              includeSigningTime: true,
              # Optionally set the container within the signature rectangle on which to place the text. By
              # default, the text can occupy the entire rectangle (how much of the rectangle the text will
              # actually fill depends on the length and font size). Below, we specify that the text should respect
              # a right margin of 1.5 cm.
              container: {
                  left: 0,
                  top: 0,
                  right: 1.5,
                  bottom: 0
              }

          },
          image: {

              # We'll use as background the image content/PdfStamp.png
              resource: {
                  content: Base64.encode64(get_pdf_stamp_content),
                  mimeType: 'image/png'
              },
              # Opacity is an integer from 0 to 100 (0 is completely transparent, 100 is completely opaque).
              opacity: 50,
              # Align the image to the right
              horizontalAlign: 'Right',
              # Align the image to the center
              verticalAlign: 'Center'

          },
          # Position of the visual representation. We have encapsulated this code in a function to include several
          # possibilities depending on the argument passed to the function. Experiment changing the argument to
          # see different examples of signature positioning. Once you decide which is best for your case, you can
          # place the code directly here. See file helpers/pades_helper.rb
          position: {
              pageNumber: -1, # negative values represent pages counted from the end of the document (-1 is
              # last page)
              measurementUnits: 'Centimeters',
              auto: {
                  # Specification of the container where the signatures will be placed, one after the other
                  container: {
                      # Specifying left and right (but no width) results in a variable-width container with the
                      # given margins
                      left: 2.54,
                      right: 2.54,
                      # Specifying bottom and height (but no top) results in a bottom-aligned fixed-height
                      # container
                      bottom: 2.54,
                      height: 12.31
                  },
                  # Specification of the size of each signature rectangle
                  signatureRectangleSize: {
                      width: 5,
                      height: 3
                  },
                  # The signatures will be placed in the container side by side. If there's no room left, the
                  # signatures will "wrap" to the next row. The value below specifies the vertical distance
                  # between rows
                  rowSpacing: 1
              }
          }
      }
  end
end