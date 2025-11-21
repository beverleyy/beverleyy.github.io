(function($) { "use strict";
	function scrollBanner() {
	  $(document).on('scroll', function(){
      var scrollPos = $(this).scrollTop();
        $('.parallax-fade-top').css({
          'top' : (scrollPos/2)+'px',
          'opacity' : 1-(scrollPos/700)
        });
        $('.parallax-00').css({
          'top' : (scrollPos/-3.5)+'px'
        });
        $('.parallax-01').css({
          'top' : (scrollPos/-2.8)+'px'
        });
        $('.parallax-top-shadow').css({
          'top' : (scrollPos/-2)+'px'
        });
      });    
	  }
	scrollBanner();    
    $(document).ready(function() {  			
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