;(function($){
    $(".base-pic").each(function(){
        var that = $(this);
        that.css({
            "background":"url("+ that.attr("data-img")+")",
            "background-size":"cover"
        })
    })






})(Zepto)






