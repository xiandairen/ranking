/**
 * Created by Villen on 15/5/19.
 */
//var vote_url = 'http://192.168.11.180:9501/v2.1/vote/add';
//var vote_url = 'http://juzi.com/home/news/newsVoteDo';

//var vote_do_url = "http://devapi.app.happyjuzi.com/v2.3/vote/add";
//var vote_dom_url = "http://devapi.app.happyjuzi.com/v2.3/article/newsVote";
var vote_do_url = "http://api.app.happyjuzi.com/v2.3/vote/add";
var vote_dom_url = "http://api.app.happyjuzi.com/v2.3/article/newsVote";


//图片data-original hello new
var scre = getUrlString('res');
var pf = getUrlString('pf');
var webp = pf=='android' ? '.webp' : '';
var img_sty; //最后要加的后缀
var own = parseInt($('#store-img').attr('data-from')); //判断第三方
var sty = '!ac1';
var img_host = "http://images11.app.happyjuzi.com";
if(scre.indexOf('x')>0){
    var sw = scre.split('x')[0];
    if(pf=='ios'){
        sw = sw*2;
    }
    if(sw < 750){
        sty = '!ac2';
    }
}var blank=0;
var loadImg = $('.arcArea').find('.load-img');
loadImg.each(function(i,v){
    var img_url = $(v).attr('data-original');
    //判断是否加水印
    if(img_url.indexOf('.gif')>0){
        img_sty = sty+'.gif';
        webp='';
    }else if(own>0){
        img_sty = sty+'.nw';
    }else{
        img_sty = sty;
    }
    img_sty += webp;
    if(img_url.indexOf('http')>-1){
        img_host='';
    }
    //投票类型图不加后缀
    if($(v).hasClass('vote-img') || $(v).hasClass('ceng-img')){ //投票图片
        img_url = img_host+img_url;
    }else{
        img_url = img_host+img_url+img_sty;
    }
    //imglist 点击图片获取
    if($(v).hasClass('dom-img')){
        imgList[i]=img_url;
    }
    $(v).attr("data-original", img_url);
    /*if(blank_img){
        $(v).attr("src", 'http://a.happyjuzi.com/statics/a/img/blank_b.png');
    }*/
})

//@param dom vote-dom 这个投票的最外层
//_this 当前对象
var guess = function(_this,dom){
    dom.find('.vote-btn').click();
    dom.find('.guess-result').removeClass('hidden');
    var tip = _this.hasClass('guess') ? '选对了！' : '选错了！';
    dom.find('.result-tip').text(tip);
    //如果是文字
    if(!dom.hasClass('pic')){
        _this.find('img').removeClass('hidden');
        if(!_this.hasClass('guess')){
            _this.css('background','#4f4f4f');
            dom.find('.guess').css({'background':'#ff6000','color':'#fff'}).removeClass('hidden');
        }
    }
    dom.addClass('disabled');
}
//投票图片点击
var voteImgClick = function(){
    var _this = $(this).find('.vote-img');
    var _parent = _this.parents('.vote-dom');

    //判断是否已经投票了
    if(_parent.hasClass('disabled')){
        return false;
    }

    //显示蒙层了
    var h = _this.height();
    var w = _this.width();

    if(_parent.hasClass('single')){
        var re = _parent.find('.vote-img');
        //单选情况下，取消选择，要把之前加上到1再剪掉
        re.each(function(i,v){
            if($(v).hasClass('active')){
                var pe = $(v).parents('.col').find('.pe');
                pe.attr('data',pe.attr('data')-1);
            }
            $(v).removeClass('active');
        });
        _parent.find('i').addClass('hidden');
    }

    var pe =_this.parents('.col').find('.pe'); //找到数值div
    //var pare = _this.parent();
    if(_this.hasClass('active')){
        _this.removeClass('active');
        pe.attr('data',pe.attr('data')-1);
        _this.next('i').addClass('hidden'); //只有在图片类型下使用

    }else{
        _this.addClass('active');
        pe.attr('data',parseInt(pe.attr('data'))+1);

        //如果是猜对错的话，直接进行
        if(_parent.hasClass('is-guess')){
            guess(_this,_parent);
            var _i = _parent.find('.guess').next('i');
            _i.css({'height':h, 'width':w}).removeClass('hidden');//只有在图片类型下使用
            //遮蔽层上的图片位置
            var hh = _this.height()
            _i.find('img').css('margin-top',hh/2-_i.find('img').height()/2+'px');
        }
        //添加涂层
        var _i = _this.next('i');
        _i.css({'height':h, 'width':w}).removeClass('hidden');//只有在图片类型下使用
        //遮蔽层上的图片位置
        var hh = _this.height()
        _i.find('img').css('margin-top',hh/2-_i.find('img').height()/2+'px');

    }
};
//异步获取投票节点
var getVoteDom = function(v_id){
    var img_url = "http://images11.app.happyjuzi.com/";
    $.ajax({
        type: "get",
        url: vote_dom_url,
        data: {"id":v_id,"style":"share"},
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"success_jsonpCallback"+v_id,
        success: function(html){
            $("#vote_"+v_id).html(html.dom);
            var imgs = $(".arcArea").find(".load-img");
            imgs.each(function (i, v) {
                $(v).attr("src", $(v).attr("data-original")).removeClass("load-img");
            });
            $('.div-img').on('click',voteImgClick);
            $('.vote-btn').on('click',voteBtnClick);
        },
        error: function(xhr, type){
            console.log(type);
            console.log("Ajax error!")
        }
    })
}
//点击投票按钮
var voteBtnClick = function(){
    //已经投票了
    if($(this).hasClass('disabled')){
        return false;
    }
    var _parent = $(this).parents('.vote-dom');
    var act = _parent.find('.active');
    if(act.length=='0'){
        return false;
    }
    var data = ''; //拼接id
    var vote_id = _parent.attr('id');
    var n = parseInt(_parent.attr('data')); //选了几项投票  原始值

    if(_parent.hasClass('single')){ //如果是单选
        data = act.attr('name');
        n++;
    }else{
        var da = new Array();
        act.each(function(i,v){
            //data += '-'+$(v).attr('name');
            da[i] = $(v).attr('name');
            n++;
        })
        data = da.join();

    }
    $.ajax({
        type: 'get',
        url: vote_do_url,
        data: {"id":vote_id,"optionids":data},
        dataType: 'jsonp',
        jsonp: "callback",
        jsonpCallback:"success_jsonpCallback",
        success: function(){
            console.log('ok')
        },
        error: function(xhr, type){
            console.log(type);
            console.log('Ajax error!')
        }
    })
    //返回结果处理（结果比例重置，类似进度条）
    var div_img = _parent.find('.pe');

    if(_parent.hasClass('pic')){
        div_img.each(function(i,v){
            $(v).removeClass('hidden');
            var da = (parseInt($(v).attr('data'))/n);

            da = Math.round(da *100)+'%';
            $(v).find('span').text(da);
            $(v).find('div').animate({'width':da},'1000');
        });

    }else{
        div_img.each(function(i,v){
            $(v).removeClass('hidden');
            var da = (parseInt($(v).attr('data'))/n);
            da = Math.round(da *100)+'%';
            $(v).find('span').text($(v).attr('data')+'票 (' +da+')');
            //$(v).find('div').css('width',da);
            $(v).find('div').animate({'width':da},'1000');
        });
    }

    //按钮灰质
    _parent.find('.vote-btn').addClass('disabled').css('background','#4f4f4f').text('已投票');
    //图片不可点击
    _parent.addClass('disabled');
}

$(function(){
    //文章ID
    var news_id = $('body').attr('data-id');
    //投票位的点击事件
    $('.div-img').on('click',voteImgClick);
    $('.vote-btn').on('click',voteBtnClick);
    //到期图片样式重置
    /*var voteDoms = $('.vote-dom');
    if(voteDoms.length>0){
        voteDoms.each(function(i,v){
            if($(v).hasClass('disabled')){
                var show_pe = $(v).find('.pe-show');
                show_pe.each(function(x,y){
                    $(y).animate({'width':$(y).next().attr('data-num')},'1000');
                });
            }
        });
    }*/

    //图片高度设置
    var imgs = $('.arcArea').find('img');
    var wid = document.body.clientWidth-30;
    wid = wid>480 ? 480 : wid;
    imgs.each(function(i,v){
        var img_w = $(v).attr('width');
        if(typeof(img_w)=='string'){
            $(v).css('height',parseInt(wid/parseInt(img_w) * parseInt($(v).attr('height'))));
        }else{
            $(v).css('height','auto');
        }
    });
    //推荐文章图片尺寸设置
    var re_h = wid*0.49*0.75;
    var recommend = $('#recommend-dom');
    recommend.find('img').css('height',re_h);
    recommend.find('.re-img').css('height',re_h);
    /*var re_list = recommend.find('.re-list');
    var max_h=10;
    re_list.each(function(i,v){
        max_h = $(v).height>max_h ? $(v).height : max_h;
    });
    re_list.css('height',max_h);*/


//图片延迟加载
    var loadImg = $('.arcArea').find('.load-img');
    if(loadImg.length>0){
        $('.arcArea').find('.load-img').picLazyLoad();
        //自动加载hello new
        setTimeout(function(){
            var xun = setInterval(function(){
                var load = $('.arcArea').find('.load-img').eq(0);
                if(load.length>0){
                    load.attr('src', load.attr('data-original'));
                    load.removeClass('load-img');
                }else{
                    clearInterval(xun);
                }
            },500)
        },3500)
    }

//视频
    var ifr = document.getElementsByTagName('iframe')[0];
    var h =  document.body.clientWidth-30;
    if(ifr){
        w = h>460 ? 460 : h;
        ifr.width = h;
        ifr.height=0.75*w;
        //$('.arcArea').css('margin-top',0.75*w+'px');
        //ifr.style.left = h/2-w/2+'px';
    }

//音频
    var audios = $('audio');
    var audios_bar;
    var load_audio = function(au){
        var audi = $(au);
        if(audi.hasClass('load-audio')){
            if(au.readyState==4){
                audi.removeClass('load-audio');
                //var dur = au.duration;
                audi.removeClass('load-audio');
                //audi.next().text(dur+'s');
                /*var dur = parseInt(au.duration);
                audi.before(dur+'s').removeClass('load-audio');*/
                /*if(dur<15){
                    audios_bar='60';
                }else{
                    audios_bar=dur;
                }
                var pre = audi.prev();
                pre.css({"width":audios_bar+'px','transition':'width 2s','-webkit-transition':'width 2s'});*/

            }else{
                setTimeout(function() {
                    load_audio(au);
                },500)

            }
        }
    }
    audios.each(function(i,v){
        load_audio(v);
    })

    $('.audio-bar').on('click',function(){
        var _this = $(this);
        var myAudio = _this.next('audio')[0];
        //如果是出于暂停状态
        if(myAudio.paused){
            //停止所有播放
            audios.each(function(i,v){
                if(!v.paused){
                    v.currentTime=0;
                    v.pause();
                    return false;
                }
            })
            //开启当前播放
            myAudio.play();
            $('.audio-bar').removeClass('audio-ing');
            _this.addClass('audio-ing');
            statPoint('','','','','','','','','','event?mod=auon&arg='+news_id);
            //监听停止事件
            myAudio.addEventListener('ended', function(){
                _this.removeClass('audio-ing');
            })
        }else{
            myAudio.currentTime=0;
            myAudio.pause();
            _this.removeClass('audio-ing');
            statPoint('','','','','','','','','','event?mod=auoff&arg='+news_id);
        }

    })

    //文章中所有图片hello pass
    /*var contentImg = $('.dom-img');
    //var storeImg = $('#store-img');
    contentImg.each(function(i,v){
        var ur = $(v).attr('src');
        if(ur.indexOf('gif')<0){
            imgList[i] = ur
            //storeImg.append(','+ur);
        }
    })*/


})

//埋点方法
//var statPoint = function(uid,ver,channel,more){
var statPoint = function(uid,mid,ver,phone,os,ov,rs,net,channel,more){

    var navi = window.navigator;
    var mid = getUrlString('mid');
    var os = getUrlString('pf') || navi.appCodeName;
    var version = navi.appVersion.substr(ua.indexOf('version/')+8,4);
    var ov = version=='cint' ? '' : version;
    var phone = getUrlString('ph');
    var mac = getUrlString('mac');
    //var myDate = new Date();
    var rs = getUrlString('res') ||  window.screen.width+'*'+window.screen.height;
    var net = getUrlString('net');
    var uid = getUrlString('uid');
    var channel = getUrlString('channel');
    var cid = getUrlString('cid');
    var ver = getUrlString('ver');
    var url = 'http://d.happyjuzi.com:8011/in';

    var data = 'head?pro=juzi&uid='+uid+'&mid='+mid+'&ver='+ver+'&mac='+mac+'&cid='+cid+'&ph='+phone+'&os='+os+'&ov='+ov+'&rs='+rs+'&net='+net+'&ch='+channel+'#'+more;
    $.ajax({
        type: 'POST',
        url: url,
        data: {"data":data},
        dataType: 'text',
        jsonp: "callback",
        jsonpCallback:"success_jsonpCallback",
        success: function(){
            return true;
            //返回结果处理（结果比例重置，类似进度条）
        },
        error: function(xhr, type){
            console.log('Ajax error!');
        }
    })
}

//获取URL参数
function getUrlString(name) {
    var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return  unescape(r[2]);
    }else if(name='d_source' && r==null){
        var reg = new RegExp("(^|&)d=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null){
            return  'toutiao';
        }
    }
    return '';
}