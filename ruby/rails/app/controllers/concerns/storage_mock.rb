require 'securerandom'

module StorageMock
  include ActiveSupport::Concern

  def exist?(file_id, extension = nil)
    path = get_data_path(file_id, extension)
    File.exist?(path)
  end

  def get_data_path(file_id, extension = nil)
    filename = file_id.gsub('_', '.')
    # Note: we're passing the filename arguments with "_" as "." because of URL
    # safety.
    filename += extension unless extension.nil?

    Rails.root.join('private', 'files', filename)
  end

  def get_resource_path(resource_file)
    Rails.root.join('private', resource_file)
  end

  def generate_filename(extension, filename = nil)
    valid_extension = nil

    if filename.nil?
      filename = ''
    else
      valid_extension = filename.slice! File.extname(filename)
    end

    valid_extension = extension unless extension.nil? || extension.empty?

    name = ''
    unless filename.nil? || filename.empty?
      name += filename
      name += '.'
    end
    name += SecureRandom.uuid
    unless valid_extension.nil? || valid_extension.empty?
      name += '.' if valid_extension[0] != '.'
      name += valid_extension
    end

    name
  end

  def generate_file_id(extension, original_filename=nil)
    filename = generate_filename(extension, original_filename)
    filename.gsub('.', '_')
    # Note: The file_id are generated with "." as "_" because of URL safety.
  end

  def retrieve_filename(file_id)
    filename = file_id.gsub('_', '.')
    # Note: we're passing the filename arguments with "_" as "." because of URL
    # safety.
    first_index = filename.index('.')
    last_index = filename.rindex('.')
    if first_index >= 0 && last_index >= 0 && first_index < last_index
      return filename[0..(first_index - 1)] + filename[last_index..-1]
    end
    filename
  end

  def store(content, extension = nil, filename = nil)
    file_id = generate_filename(extension, filename)

    # Ensure files folder exists
    files_folder = Rails.root.join('private', 'files')
    Dir.mkdir(files_folder) unless File.directory?(files_folder)

    path = Rails.root.join('private', 'files', file_id)
    File.open(path, 'wb') do |file|
      file.write(content)
    end

    file_id.gsub('.', '_')
    # Note: The file_id are generated with "." as "_" because of URL safety.
  end

  def get_sample_doc_name(sample_id)
    case sample_id.to_sym
    when :sample_pdf
      'SamplePdf.pdf'
    when :pdf_signed_once
      'SamplePdfSignedOnce.pdf'
    when :pdf_signed_twice
      'SamplePdfSignedTwice.pdf'
    when :cms_signed_once
      'SampleCms.p7s'
    when :cms_signed_twice
      'SampleCmsSignedTwice.p7s'
    when :sample_xml
      'SampleXML.xml'
    when :sample_nfe
      'SampleNFe.xml'
    else
      raise Exception('File not found')
    end
  end

  def get_sample_doc_path(sample_id)
    filename = get_sample_doc_name(sample_id)
    get_resource_path(filename)
  end

  def get_batch_doc_path(id)
    Rails.root.join('private', "0#{id.to_i % 10}.pdf")
  end

  def get_pdf_stamp_content
    content = nil
    File.open(Rails.root.join('private', 'stamp.png'), 'rb') do |file|
      content = file.read
    end
    content
  end


end