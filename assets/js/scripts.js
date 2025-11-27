$(document).ready(function(){
    $(document).tooltip({
        track:true
    });
    var $f = $('.carousell').flickity({
        autoPlay:3000,
        wrapAround:true,
        imagesLoaded:true,
        prevNextButtons:false
    });
    // $(window).on("resize",function(){
    //     $f.flickity("resize");
    // });
    $("#pubs").hover(function(){
        $("#right").fadeOut("fast");
        $("#top").addClass("active");
    },function(){
        $("#top").removeClass("active");
        $("#right").fadeIn("fast");
    });
    var isotope_options = {
        itemSelector:'.item',
        layoutMode:'packery',
        percentPosition:true
    };
    var $allgrids = $('.grid:not([data-category="main"])').isotope(isotope_options);
    var $container = $('.grid[data-category="main"]');
    var filters = {}; 
    var $grid = $container.isotope(isotope_options);
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
        $allgrids.isotope('layout');
    }
    // var now = new Date().getHours();
    // if (now >= 20 || now < 8){
    //     
    // } else {
    //     
    // }
    const storedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light");
    if (storedTheme) {
        var $toggleSwitch = $("#switch i");
        if (storedTheme == 'dark') 
            $toggleSwitch.addClass("ti-flame-off").removeClass("ti-flame");
        else 
            $toggleSwitch.addClass("ti-flame").removeClass("ti-flame-off");
    }
    $("#switch").on("click",function(e){
        var targetTheme = document.documentElement.getAttribute("data-theme")==="light" ? "dark":"light";
        localStorage.setItem("theme",targetTheme);
        document.documentElement.setAttribute("data-theme", targetTheme);
        $(this).children("i").toggleClass("ti-flame ti-flame-off");
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
    // $("#pubslist .terminal ul li").addClass("ti-caret-right");

    const $root = $(document.documentElement);
    const $items = $(".toggler li");
    document.documentElement.style.setProperty('--active', 0);
    $items.each(function(index) {
        const $item = $(this);
        const tab = $item.children("a:first-child").attr('href').replace('#', '');

        this.style.setProperty('--i', index);
        if (index === 0){
            $item.attr("data-active", true);
            $('[data-category]').hide();
            $('[data-category="'+tab+'"]').show();
        } 
        $item.on("click", function (e) {
            document.documentElement.style.setProperty('--active', index);
            $root.find("[data-active]").removeAttr("data-active");
            $item.attr("data-active", true);
            e.preventDefault();

            // switch contents
            $('[data-category]').hide();
            $('[data-category="'+tab+'"]').show();
            shuffle();

            if (tab!='main')
                $("#proff").parent('h1').attr('data-text',"'s playground")
            else
                $("#proff").parent('h1').attr('data-text',' Yeo')
        });
    });
});
