class DownloadController < ApplicationController

  def get
    file_id = params[:file_id]

    if file_id.nil? || !exist?(file_id)
      render status: 404
    else
      filename = retrieve_filename(file_id)
      path = get_data_path(file_id)
      send_file(path, filename: filename)
    end
  end

  def sample
    sample_id = params[:sample_id]
    filename = get_sample_doc_name(sample_id)
    path = get_sample_doc_path(sample_id)
    send_file(path, filename: filename)
  end
end
