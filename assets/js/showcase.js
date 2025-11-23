(function($) { "use strict";
    function parallaxScroll(){
        var $header = $('header.full-height'),
            fullHeight = $header.outerHeight(),
            scrollPos = $(this).scrollTop();
        $('header.full-height').css({
          'margin-bottom': -(scrollPos)+'px',
          'opacity': 1-(2*scrollPos/fullHeight)
        });
    }    
    $(window).on('resize', parallaxScroll);
    $(window).on('load', parallaxScroll);
    $(document).on('scroll', parallaxScroll); 
    $(document).ready(function(){  		
        parallaxScroll();	
        $('.case-study-name').on('mouseenter', function() {
            const index = $(this).index() + 1; // nth-child is 1-based
            $('.case-study-name.active').removeClass('active');
            $('.case-study-images li.show').removeClass("show");
            $('.case-study-images li:nth-child(' + index + ')').addClass("show");
            $(this).addClass('active');
        });
        $('.case-study-name').first().trigger('mouseenter');
        $('.case-study-name a').click(function(){
          $(this).parent().trigger('mouseenter');
          return false;
        });
    });            
})(jQuery); 