module PadesVisualElementsExpress
  include ActiveSupport::Concern
  include Util

  # This method is called by PAdES samples. It contains an example of signature
  # visual representation. This is only in a separate in order to organize the
  # various examples.
  def get_visual_representation

    # Create a visual representation
    vr = PkiExpress::PadesVisualRepresentation.new

    # The tags {{name}} and {{national_id}} will be substituted according
    # to the user's certificate:
    #
    #      name         : full name of the signer;
    #      national_id  : if the certificate is ICP-Brasil, contains the
    #                     signer's CPF.
    # For a full list of the supported tags, see:
    # https://docs.lacunasoftware.com/articles/pki-express/pades-tags.html
    text = PkiExpress::PadesVisualText.new('Signed by {{name}} ({{national_id}})', true)
    text.font_size = 13.0
    # Create a text  container and add PadesVisualText object.
    container = PkiExpress::PadesVisualRectangle.new
    container.set_vertical_stretch(0.2, 0.2)
    container.set_horizontal_stretch(0.2, 0.2)
    text.container = container
    # Add text to visual representation.
    vr.text = text

    # Create an instance of PadesVisualImage class.
    image = PkiExpress::PadesVisualImage.new
    # Set the content of the image
    image.content = get_pdf_stamp_content
    # Add image to visual representation.
    vr.image = image

    # Create an instance of PadesVisualAutoPositioning class. This class will
    # create a custom auto positioning for the visual representation.
    position = PkiExpress::PadesVisualAutoPositioning.new
    # Set the page number. Negative values represent pages counted form the end
    # of the document (-1 is the last page).
    position.page_number = -1
    # Set the row spacing between signatures. The signatures will be placed in
    # container side by side. If there's no room left, the signatures will
    # "wrap" to the next row. This value specifies the vertical distance between
    # rows.
    position.row_spacing = 0.0
    # Specify the size of each signature rectangle.
    size = PkiExpress::PadesSize.new(8.0, 4.94)
    position.signature_rectangle_size = size
    # Create the position container and add to PadesVisualPosition object.
    position_container = PkiExpress::PadesVisualRectangle.new
    position_container.set_height_bottom_anchored(4.94, 1.5)
    position_container.set_horizontal_stretch(1.5, 1.5)
    position.container = position_container
    # Add position to visual representation.
    vr.position = position

    # Return visual representation.
    vr
  end
end