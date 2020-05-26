$(document).ready(function(){
    $(document).tooltip({
        track:true
    });
    $(".console").draggable({
        handle: ".topper"
    });
    orbitPlanet();
    $(window).on("resize", function(){
        orbitPlanet();
    });
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        adaptiveHeight:true,
        asNavFor: '.slider-nav',
        slide: 'div'
    });
    $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots:false,
        centerMode: true,
        focusOnSelect: true,
        variableWidth:true,
        slide: 'div'
    });
    $("a.sub").on("click",function(e){
        var id = $(this).attr("data-popup");
        $(".console"+id).siblings(".console").fadeOut(function(){
            $(".console"+id).fadeIn();
        });
        $('.slider-for').slick('resize');
        e.preventDefault();
    });
    $("a.c").on("click",function(e){
        $(this).parents(".topper").parent().fadeOut();
        e.preventDefault();
    });
    $("a.x").on("click",function(e){
        $(this).parents(".topper").parent().fadeOut(function(){
            if($(this).attr("id") == "terminal"){
                $("#banner").css("cursor","pointer");
            }
            else {
                $(".map-point,#banner").removeClass("small big");
            }
        });
        e.preventDefault();
    });
    $("#banner").click(function(e){
        $("#terminal").fadeIn();
        $(this).css("cursor","auto");
        e.preventDefault();
    });
    var airportPos = $("#banner").position();
    $("#plane").css("left", airportPos.left + $("#plane").width() / 2);
    $("#plane").css("top", airportPos.top + $("#plane").height() / 2);
    $(".map-point").on("mouseover", function(){
        hoverMap($(this));
        $(".fire").css({"opacity":1});
    });
    $(".map-point").click(function(e){
        $("#terminal").fadeOut();
        $("#banner").css("cursor","pointer");
        var $this = $(this);
        var point = $this.offset();
        $(".map-point").off("mouseover", hoverMap($(this)));
        $("#plane").animate({
            left: point.left,
            top: point.top 
        }, function(){
            $(".map-point").on("mouseover", function(){
                hoverMap($(this));
                $(".fire").css({"opacity":1});
            });
            if ($('.map-point:hover').length)
                $('.map-point:hover').trigger("mouseover");
            $(".fire").animate({"opacity":0});
            if($this.hasClass("big")){
                $(".console").fadeOut();
                setTimeout(function(){
                    $this.removeClass("big");
                    $this.siblings().removeClass("small big");
                },400);
            }
            else {
                setTimeout(function(){
                    var terminal = $this.attr("data-terminal");
                    $this.removeClass("small").addClass("big");
                    $this.siblings().addClass("small");
                    setTimeout(function(){
                        $(".console"+terminal).siblings(".console").fadeOut(function(){
                            $(".console"+terminal).fadeIn();
                        });
                    },400);
                },400);
            }
        });
        e.preventDefault();
    });
    $("#plane").click(function(){
        $(".console:not(#terminal)").fadeOut(function(){
            $(".map-point,#banner").removeClass("small big");
        });
    });
});

function orbitPlanet() {
    var count = $(".path").length;
    var x0 = window.innerWidth / 2;
    var y0 = window.innerHeight / 2;
    for (var i = 1; i <= count; i++) {
        var rx = $(".path").eq(count - i).innerWidth() / 2;
        var ry = $(".path").eq(count - i).innerHeight() / 2;
        var t = Math.tan((i-1) * Math.PI / count + Math.atan(2 * ry / rx) / 2);
        var x = x0 + rx * (1 - t ** 2) / (1 + t ** 2);
        var y = y0 + ry * 2 * t / (1 + t ** 2);
        $(".map-point").eq(i - 1).each(function(){
            var ri = $(this).innerWidth() / 2;
            $(this).css({
                top: y - ri,
                left: x - ri 
            });
        });
    }
    $("#planets").animate({"opacity":1});
}

function hoverMap($this) {
    var pointID = $this.attr("id");
    var turn = 180 - drawLine("#plane", "#" + pointID);
    $("#plane").css({
        "-webkit-transform": "rotate(" + turn + "deg)",
        "-ms-transform": "rotate(" + turn + "deg)",
        "transform": "rotate(" + turn + "deg)" 
    });
}

function drawLine(a, b) {
    var pointA = $(a).offset();
    var pointB = $(b).offset();
    return Math.atan2(pointB.left-pointA.left, pointB.top-pointA.top)*180/Math.PI;
}