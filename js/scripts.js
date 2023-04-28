$(document).ready(function(){
    $(document).tooltip({
        track:true
    });
    $('.main-carousel').flickity({
        // options
        autoPlay:3000,
        wrapAround:true,
        imagesLoaded:true,
        prevNextButtons:false
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
    var now = new Date().getHours();
    if (now >= 20 || now < 8){
        $("body").addClass("night").removeClass("day");
        $("#switch i").addClass("ph-sun-fill").removeClass("ph-moon-stars-fill");
    } else {
        $("body").addClass("day").removeClass("night");
        $("#switch i").addClass("ph-moon-stars-fill").removeClass("ph-sun-fill");
    }
    $("#switch").on("click",function(e){
        $("body").toggleClass("day night");
        $(this).children("i").toggleClass("ph-sun-fill ph-moon-stars-fill");
        e.preventDefault();
        console.log("click")
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
    $("#pubslist .terminal ul li").addClass("ph-caret-right");
});