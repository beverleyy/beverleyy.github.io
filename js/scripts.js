$(document).ready(function(){
    $(document).tooltip({
        track:true
    });
    $("#pubs").hover(function(){
        $("#right").fadeOut("fast");
        $("#top").addClass("active");
    },function(){
        $("#top").removeClass("active");
        $("#right").fadeIn("fast");
    });
    var $container = $(".grid");
    var filters = {}; 
    var $grid = $container.isotope({
        itemSelector: ".item",
        layoutMode: 'packery',
        percentPosition: true 
    });
    $(".option-set a").on("click",function(e) {
        var $this = $(this); 
        var filterAttr = "data-filter-value";
        var filterValue = $this.attr(filterAttr);
        var $optionSet = $this.parents(".option-set");
        var group = $optionSet.attr("data-filter-group"); 
        var filterGroup = filters[group];
        if (!filterGroup) {
            filterGroup = filters[group] = [];
        }
        var $selectAll = $optionSet.find('a['+filterAttr+'=""]'); 
        var activeClass = "selected", 
            exclClass = "exclusive"; 
        comboFiltering($this,filters,filterAttr,filterValue,$optionSet,group,$selectAll,activeClass,exclClass);
        var comboFilter = getComboFilter(filters);
        $grid.isotope({
            filter: comboFilter
        });
        $this.toggleClass(activeClass);
        e.preventDefault();
    });
	$('.item:not(.inactive)').on('click',function(e){
		var $this = $(this);
		if($(e.target).is($this.find('.close'))){
            e.preventDefault();
            return;
        }
		$this.addClass('expand');
        $('.item').not(this).removeClass('expand');
		$('.item').not(this).children('.back,.topper').fadeOut();
		$this.children('.back,.topper').fadeIn();
	});
	$('.item .topper .close').on("click",function(e){
		var $this = $(this).parents(".item");
		$this.children('.back,.topper').fadeOut(function(){
			$this.removeClass('expand');
		});
		e.preventDefault();
	});
    Array.prototype.forEach.call(document.querySelectorAll('.item:not(.inactive)'), function(el, i){
        el.addEventListener('transitionend',shuffle);
        el.addEventListener('transitioncancel',shuffle);
    });
    function shuffle(){
        $grid.isotope('layout');
    }
    $("#switch a").on("click",function(e){
        $("body").addClass($(this).attr("data-id"));
        $("body").removeClass($(this).siblings("a").attr("data-id"));
        $(".option-set a").removeClass("selected");
        $(".option-set a[data-filter-value='']").addClass("selected");
        $grid.isotope({filter:''});
        e.preventDefault();
    });
	$(".popp").on("click",function(e){
		e.preventDefault();
		var id=$(this).attr("href");
        $('body').addClass('noscroll');
		$('modal'+id).fadeIn(function(){
            $('modal'+id).css("display","flex");
        });
	});
	$(".popup .topper .close").on("click",function(e){
        $('body').removeClass('noscroll');
		$(this).parents("modal").fadeOut();
		e.preventDefault();
	});
	$("modal").on("click",function(e){
		if($(e.target).is($(this).find('*'))){
            e.preventDefault();
            return;
        }
		else {
			$('body').removeClass('noscroll');
			$(this).fadeOut();
			e.preventDefault();
		}
	});
});