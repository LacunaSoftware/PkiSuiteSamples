class BatchPadesRestController < ApplicationController

  # This action renders the batch signature page.
  #
  # Notice that the only thing we'll do on the server-side at this point is determine the IDs of the documents
  # to be signed. The page will handle each document one by one and will call the server asynchronously to
  # start and complete each signature.
  def index
    # It is up to your application's business logic to determine which element ids will compose the batch.
    @document_ids = (1..30).map { |i| ("%02d" % i) }
  end
end
