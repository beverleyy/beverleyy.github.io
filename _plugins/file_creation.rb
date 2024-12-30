# Plugin: Sort Jekyll Collections by File Creation Date
# Supports fallback to modified date if creation date is unavailable.
# Works on macOS, Linux (with supported filesystems), and Windows.

require 'jekyll'

# Windows support using the `win32-file` gem
begin
  require 'win32/file'
  WINDOWS_SUPPORT = true
rescue LoadError
  WINDOWS_SUPPORT = false
end

module Jekyll
  module CreationDate
    # Method to get file creation date
    def self.creation_date(filepath)
      if WINDOWS_SUPPORT && Gem.win_platform?
        # Use win32-file gem on Windows
        Win32::File.new(filepath).creation_time
      elsif File.respond_to?(:birthtime)
        # Use File.birthtime on macOS/Linux with creation date support
        File.birthtime(filepath)
      else
        # Fallback to last modified time
        File.ctime(filepath)
      end
    rescue => e
      Jekyll.logger.warn "CreationDate Plugin:", "Error fetching creation date for #{filepath}: #{e.message}"
      File.ctime(filepath) # Safe fallback
    end
  end
end

# Hook into Jekyll's build process
Jekyll::Hooks.register :documents, :pre_render do |document|
  filepath = document.path
  document.data['creation_date'] = Jekyll::CreationDate.creation_date(filepath)
end

Jekyll::Hooks.register :site, :post_read do |site|
  site.collections.each do |_, collection|
    # Sort collection docs by creation_date in reverse order (newest first)
    collection.docs.sort_by! { |doc| doc.data['creation_date'] || Time.at(0) }.reverse!
  end
end
