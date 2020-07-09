class ServerFilesController < ApplicationController

  # GET /server-files
  # This action will render a page to show the available server files to be used
  # on the sample referred by "rc" parameter.
  def index
    @rc = params[:rc]
    @op = params[:op]

    @available_files = []
    @is_cms_cosign = false

    case @op
    when 'cosign-cms'
      @is_cms_cosign = true
      @available_files.append(id: :cms_signed_once, description: 'A sample CMS file that was signed once.')
      @available_files.append(id: :cms_signed_twice, description: 'A sample CMS file that was signed twice.')
    when 'cosign-pdf'
      @available_files.append(id: :pdf_signed_once, description: 'A sample PDF that was signed just once.')
      @available_files.append(id: :pdf_signed_twice, description: 'A sample PDF that was signed twice.')
    when 'printer-friendly'
      @available_files.append(id: :pdf_signed_once, description: 'A sample PDF that was signed just once.')
      @available_files.append(id: :pdf_signed_twice, description: 'A sample PDF that was signed twice.')
    when 'sign-cms'
      @available_files.append(id: :sample_pdf, description: 'A sample PDF document (size: 25kb) with no signatures.')
    when 'sign-pdf'
      @available_files.append(id: :sample_pdf, description: 'A sample PDF document (size: 25kb) with no signatures.')
    else
      raise Exception('Invalid operation')
    end
    # Is it up to your application's business logic to determine which server
    # documents to be available for the signature.
  end

  # POST /server-files
  # This method is called when the user chooses a sample file. It will get the
  # file's content and will store it on a temporary folder using our StorageMock
  # class.
  def action

    path = get_sample_doc_path(params[:chosen_file_id])
    filename = get_sample_doc_name(params[:chosen_file_id])

    # Copy file to the temporary folder, where the upload files are stored.
    file_id = nil
    if params[:is_cms_cosign] == 'false'
      File.open(path, 'rb') do |file|
        file_id = store(file.read, 'pdf', filename)
      end
    elsif params[:is_cms_cosign] == 'true'
      File.open(path, 'rb') do |file|
        file_id = store(file.read, 'p7s', filename)
      end
    end

    # Only the REST PKI sample needs to pass this file as "cosign" variable when
    # cosigning a CMS file.
    if (params[:rc] == 'cades-signature-rest') && (params[:is_cms_cosign] == 'true')
      redirect_to "/#{params[:rc]}/cosign/#{file_id}"
    else
      redirect_to "/#{params[:rc]}/#{file_id}"
    end
  end
end
