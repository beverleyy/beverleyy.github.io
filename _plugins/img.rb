module Jekyll
  module ImgFilter
    def img(input)
      "/assets/images/#{input}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImgFilter)

