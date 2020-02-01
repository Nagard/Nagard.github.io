$(function() {
    window.SPC_SITE = {};
    
    SPC_SITE.setFooterHeight = function() {
        return;
        //set footer height
        var windowHeight = $(window).height(),
            bodyHeight = $(document.body).height(),
            footerHeight = $("#footer").height(),
            diff = windowHeight - bodyHeight,
            $body = $(document.body);
            
        $body.css({
            "overflow-y": "auto"
        });
        
        if (diff > 0) {
            $("#footer").height(windowHeight - $("#footer").offset().top - 30);
            $body
                .css({
                    "overflow-y": "hidden"
                })
                .scrollTop(0);
        }
    };
    
    $(window).on("resize", function(e) {
        SPC_SITE.setFooterHeight();
    }).on("load", function() {
        SPC_SITE.setFooterHeight();
    });
    
    if (window.SyntaxHighlighter) {
        SyntaxHighlighter.highlight();
    }
    
    $("#nav-links")
        .on("mouseenter", ">li", function(e) {
            $(this).find("ul").show();
        })
        .on("mouseleave", ">li ul", function(e) {
            if ($(e.target).closest("#nav-links").length) {
                console.log($(e.target).closest("#nav-links"))
                //return;
            }
            $(this).hide();
        })
        .on("mouseenter", ">li ul li", function(e) {
            $(this).addClass("active-color").siblings().removeClass("active-color");
        })
        
        ;
        
    $(document)
        .on("click", function(e) {
            if ($(e.target).closest(".hide-on-doc-click").length) {
                return;
            }

            $(".hide-on-doc-click").hide();
        })
        .on("click", ".mobile-menu-icon", function(e) {
            console.log("mobile menu")
            $("#nav-links").toggle();
        });
        
    $('.slider').slick({
        dots: true,
        infinite: true,
        arrows: true,
        prevArrow: "<i class='spc-icon icon-chevron-thin-left page prev'></i>",
        nextArrow: "<i class='spc-icon icon-chevron-thin-right page next'></i>",
        //centerMode: true,
        //slidesToShow: 3,
        //slidesToScroll: 3,
            //variableWidth: true
    });
    
    
});