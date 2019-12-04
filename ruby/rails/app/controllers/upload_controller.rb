class UploadController < ApplicationController

  def index
    @rc = params[:rc]
  end

  def action
    # Check that a file was indeed uploaded
    raise 'No file upload' if params[:upload_form].nil?

    file = params[:upload_form][:userfile]
    original_filename = file.original_filename
    file_id = store(file.read, nil, original_filename)
    redirect_to "/#{params[:rc]}/#{file_id}"
  end
end
