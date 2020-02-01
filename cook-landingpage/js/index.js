$(function() {
    $("#showcase").wrap("<div class='top'></div>");
    
    
    //signup
    $("#signup").on("click", function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            dataType: "json",
            url: "app/SpcEngine.php",
            data: {
                sender: "public",
                spcAppRequest: "core/user/signup",
                params: {
                    isArray: true,
                    password: $("#signup-form-password").val(),
                    email: $("#signup-form-email").val()
                }
            },
            success: function(res) {
                if (res.success == true) {
                    window.location.href = "app";
                }
            }
        });
    });

    $("#showcase").height($(window).height());
    $(window).on("resize", function(e) {
        $("#showcase").height($(window).height());
    });

    $(window).on("scroll", function(e) {
       
            $("#header").addClass("scrolled");
            $("#top-logo").attr("src", "logo-4.png");
        
		
	/*	if ($(window).scrollTop() > 45) {
            $("#header").addClass("scrolled");
            $("#top-logo").attr("src", "logo-4.png");
        } else {
            $("#header").removeClass("scrolled");
            $("#top-logo").attr("src", "logo-3.png");
        }
		*/
		
    });
    $("html, body").trigger("scroll");
});