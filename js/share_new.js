var winWidth = $(".wrap").width();
var artWidth = $(".artWrap").width();
var ua = navigator.userAgent.toLowerCase();
/*if($(".artTop img").length > 0){
    $(".artTop").attr("style","height:"+artWidth*3/4+"px");
}else{
    $(".artTop").remove();
}*/
$(".nav li").click(function(){
    $(this).addClass("cur").siblings().removeClass("cur");
})
//滚动加载
var listpageYm = 1;
var loadflag = true;
var islistpage = false;
var lc = window.location.href;
var turl = ""
if(lc.indexOf("index") >-1 || lc.indexOf("hot") >-1 || lc.indexOf("recommend") >-1){
    islistpage = true;
}
if(lc.indexOf("index") >-1){
    turl = "";
    ajaxReadlist(turl);
}else if(lc.indexOf("hot") >-1){
    turl = "hot";
    ajaxReadlist(turl);
}else if(lc.indexOf("recommend") >-1){
    turl = "recommend";
    ajaxReadlist(turl);
}

function ajaxReadlist(s){
    $.ajax({
        type: 'post',
        dataType: 'jsonp',
        async:false,
        url: 'http://devapi.app.happyjuzi.com/v1.1/home/get?type='+s+'&page='+listpageYm,
        beforeSend: function() {
            $(".loading").show();
        },
        success: function(data){
            $(".loading").hide();
            if(data.toutiao != undefined && data.page == 1){
                var thtml = "";
                var swipeLength = data.toutiao.length;
                $.each(data.toutiao,function(i, item) {
                    var itemImgSrc = item.pic.src;
                    if(itemImgSrc.indexOf("!")>-1){
                        itemImgSrc = itemImgSrc +"jpg";
                    }
                    thtml += "<div><a href=\"art.html?id="+item.id+"\">";
                    thtml += "<img src=\""+itemImgSrc+"\"/>";
                    thtml += "<p class=\"swipeWz\">";
                    thtml += "<span class=\"swipeType\">"+item.catname+"</span>";
                    thtml += "<span class=\"swipeTitle\">"+item.title+"</span>";
                    thtml += "</p></a></div>";
                });
                $(".swipeWrap").append(thtml);
                for(i=0;i<swipeLength;i++){
                    $(".swipeNum").append("<li></li>");
                }
                $(".swipeNum li:nth-child(1)").addClass("cur");
                var mySwipe = new Swipe(document.getElementById('juziSwipe'), {
                    auto:3000,
                    callback: function(index, elem) {
                        $(".swipeNum li").eq(index).addClass("cur").siblings().removeClass('cur');
                    }
                });
                var swipeWidth = winWidth -16;
                $(".swipeWrap").attr("style","height:"+swipeWidth/2+"px;width:"+swipeLength*swipeWidth+"px;")
                $(".swipeWrap").find("img").attr("style","width:"+swipeWidth+"px;height:"+swipeWidth/2+"px;")
                $('.swipeNum li').on('click',function(i){
                    mySwipe.slide($(this).index());
                });
            }
            if(data.list != undefined){
                var html = "";
                $.each(data.list,function(i, item) {
                    var itemImgSrc = item.pic.src;
                    if(itemImgSrc.indexOf("!")>-1){
                        itemImgSrc = itemImgSrc +"jpg";
                    }
                    html += "<li>";
                    html += "<a href=\"art.html?id="+item.id+"\" class=\"imgCon\">";
                    html += "<img picurl=\""+itemImgSrc+"\" />";
                    html += "<p class=\"imgTitle\">"+item.title+"</p>";
                    html += "</a>"
                    html += "<p class=\"photoHandle\">";
                    html += "<span class=\"photoType\">"+item.catname+"</span>"
                    html += "<span class=\"photoCount\">"+item.readnum+"</span>"
                    html += "</p></li>"
                });
                $(".photolist").append(html);
                listpageYm = listpageYm + 1;
                loadflag = true;
            }else{
                loadflag = false;
                $(".tPage").show().html("没有更多内容");
            }
        },
        complete: function() {}
    });
}

//文章页
String.prototype.replaceAll = function(s1,s2) {
    return this.replace(new RegExp(s1,"gm"),s2);
}
function getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}
//var share_imgUrl,share_desc,share_title;
function getd(murl){

    var comment =$("#commentid");
    var commentid = comment.val();
    var newsid = commentid.split('-')[1];

    if (comment.length && commentid.length > 0) {
        //$.getJSON(murl,function(data){
        //    if(data.err!=100200){
        //加载评论
        //var curl = "http://api.app.happyjuzi.com/v1.1/comment/list?commentid="+commentid+"&page=1&size=99&callback=?";
        var curl = "http://api.app.happyjuzi.com/v2.0/comment/listcomment?id="+newsid+"&page=1&size=30&callback=?";
        $.getJSON(curl,function(data1) {
            if (data1.err == 100200) {
                console.log(data1.msg);
            } else {
                var listN = parseInt(data1.list.length);
                //$(".artCnum").html(listN + "回复").show();
                $(".comment").css("width", "" + winWidth + "px");
                var j = 0,cmHtml="",cmsTops;
                for (var i = 0; i < listN; i++) {
                    if((i+1)%3==1){
                        cmsTops = getRandomNum(5,25);
                    }else if((i+1)%3==2){
                        cmsTops = getRandomNum(40,60);
                    }else if((i+1)%3==0){
                        cmsTops = getRandomNum(75,95);
                    }
                    cmHtml += '<div class="cItem" id="citem'+i+'" style="top:' + cmsTops + 'px;left:'+(artWidth+20)+'px;z-index:' + (i + 1) + '">' + "<span><img src=" + data1.list[i].user.avatar + "></span>" + '<p>' + data1.list[i].content + '</p></div>';
                }
                $(".commentScroll").html(cmHtml);
            }
        });
    }
    //    }
    //})
}
var getArtId =$(".artWrap").attr("id");
var arturl = "http://api.app.happyjuzi.com/v1.1/article/get?id=" +getArtId+ "&callback=?&d_source=moblie"
if($(".artCon").length>0){
    getd(arturl);
    share_imgUrl = share_imgUrl || $("#img").attr("src");
    share_desc = share_desc || $("title").text();
    share_title = share_title || $("title").text() + " | 橘子娱乐™";
}
function animateFun(target, gtime) {
    return function() {
        $(target).show().animate({
                left: '-=' + ($(target).width() + artWidth + 100) + 'px'
            },
            gtime, animateFun).queue(function(next) {
                $(target).css("left", (artWidth + 20) + "px");
                next();
            });
    }
}
function startScroll(){
    var l = 0,
        slength = $(".cItem").length;
    setInterval(function() {
        if (l < slength) {
            var pitem = $(".cItem").eq(l),
                gtime = getRandomNum(7, 11) * 1000;
            animateFun(pitem, gtime)();
            setInterval(animateFun(pitem, gtime), gtime);
            l++;
        }
    },1500)
}
var _winScrollTop = 0;
$(window).on('scroll',function(){
    _winScrollTop = $(window).scrollTop();
    totalheight = parseFloat($(window).height()) + parseFloat(_winScrollTop);
    if (($(document).height() - 20) <= totalheight && loadflag == true && islistpage == true) {
        setTimeout(function(){ajaxReadlist(turl)},1000);
        loadflag = false;
    }

    if ( $("body").scrollTop() > $(window).height()/2) {
        startScroll();
        //显示关闭弹幕
        $('#hide-danmu').animate({'right':"-10px"},3000);
    }

    lazyImgFun();
});

window.onload = function(){
    lazyImgFun();
}
function lazyImgFun() {
    $(".lazyImg img").each(
        function(){
            var _this = $(this);
            var scrollTop = $(window).scrollTop();
            var _winHeight = $(window).height();
            if(_this.offset().top < _winHeight){
                _this.attr("src", _this.attr("picurl"));
            }
            if (_this.attr("src") == _this.attr("picurl")) {
                return true
            }else if(_this.offset().top - 20 <= _winHeight + _winScrollTop){
                if (_this.attr("picurl") != undefined || _this.attr("picurl") != "undefined") {
                    _this.attr("src", _this.attr("picurl"));
                    //console.log(_this.attr("src"));
                    _this.fadeTo(1000, 1.00);
                }
            }
        }
    )
}
/*页尾下载*/
//判断有无安装app
function getUrlParam(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}
if(getUrlParam("isappinstalled") == 1){
    $(".shareDownbtn").addClass('installed');
}
function tryOpenApps() {
    if(ua.indexOf("iphone") > -1 || ua.indexOf("android") > -1 ){
        window.location.href ="juzi://article?id="+parseInt($('.artWrap').attr('id'));
    }else{
        window.location.href = "http://www.happyjuzi.com/";
    }
}
function downloadApp(){
    if (ua.indexOf("iphone") > -1) {
        $(".shareDownbtn").attr("href", "https://itunes.apple.com/us/app/ju-zi-yu-le/id931179407?ls=1&mt=8");
    }else if(ua.indexOf("android") > -1){
        $(".shareDownbtn").attr("href", "http://files01.happyjuzi.com/juzi/apk/v1.0/juzi-juzi-release.apk");
    }
}
$(".shareDownbtn").click(function() {
    var dl2 = 'func?mod=dl&fuid='+getUrlString('fromuid');
    statPoint('','','','','','','','','',dl2);
    setTimeout(function(){
        if (ua.indexOf("micromessenger") > -1) {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.happyjuzi.apps.juzi";
        }else{
            if($(this).attr('class').indexOf("installed")> 0 || $(this).hasClass('installed')){
                tryOpenApps();
            }else{
                downloadApp();
            }
        }
    },500)
})

var app_data_url = encodeURIComponent(lc);
var shareDatelink = "http://a.happyjuzi.com/weixin.php?url="+app_data_url;
document.write("<script type=\"text/javascript\" src=\""+shareDatelink+"\">"+"</scr"+"ipt>");

$(function() {
    wx.config({
        debug: false,
        appId: 'wxd92ccb751aa7075b',
        timestamp: timestampData,
        nonceStr: nonceStrData,
        signature: signatureData,
        jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo']
    });

    wx.ready(function(){
        wx.onMenuShareTimeline({
            title: share_title,
            desc: share_title,
            link: lc,
            imgUrl: share_imgUrl
        });
        //分享给微信好友
        wx.onMenuShareAppMessage({
            title: share_title,
            desc: share_desc,
            link: lc,
            imgUrl: share_imgUrl
        });
        //分享给QQ
        wx.onMenuShareQQ({
            title: share_title,
            desc: share_desc,
            link: lc,
            imgUrl: share_imgUrl
        });
        //分享给QQ微博
        wx.onMenuShareWeibo({
            title: share_title,
            desc: share_desc,
            link: lc,
            imgUrl: share_imgUrl
        });
    })
})
//百度统计
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://": " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb09e89e10e3dea6858cd0fa2bc457859' type='text/javascript'%3E%3C/script%3E"));
$("<div id='hide-danmu' class='yes' style='-webkit-tap-highlight-color: rgba(0,0,0,0);-moz-tap-highlight-color: rgba(0,0,0,0);-o-tap-highlight-color: rgba(0,0,0,0);-ms-tap-highlight-color: rgba(0,0,0,0);background: #ff6000; position: fixed; bottom: 90px; right:-150px;z-index:9999;border-radius: 15px; padding: 3px 20px 3px 15px; cursor:pointer; color: #fff;font-size:11px;'>关闭弹幕</div>").insertBefore('.bottom');
$("#hide-danmu").on('click',function(){
    if($(this).hasClass('yes')){
        $(this).text('打开弹幕').removeClass('yes');
    }else{
        $(this).text('关闭弹幕').addClass('yes');
    }
    $("#commentArea").toggle('3000');
});

//iframe高度
var h =  document.body.clientWidth;
w = h>460 ? 460 : h;
var ifr = document.getElementsByTagName('iframe')[0];
/*ifr.height = 0.96*w;
 ifr.width = h;*/
if(ifr){
    var h =  document.body.clientWidth;
    //ifr.attr('height' , 0.96*w);
    ifr.height = 0.7*w;
    ifr.width = h;
}
//浏览统计
var more_v = 'dp?mod=v&id='+getArtId+'&src=1&from='+getUrlString('d_source')+'fuid='+getUrlString('fromuid');
statPoint('','','','','','','','','',more_v);