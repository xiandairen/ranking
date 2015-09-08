(function($){
    //���ͳ��
    var getArtId =$(".artWrap").attr("id"); // ���Ǵ�����̨���µ�id
    var more_v = 'dp?mod=v&id='+getArtId+'&src=1&from='+getUrlString('d_source')+'fuid='+getUrlString('fromuid');
    statPoint(more_v,null);

    //΢����Ҫ������
    share_title = "�"+ $("title").text();
    lc = window.location.href;
    share_imgUrl = $(".base-figure").eq(0).find("img").attr("src");
    share_desc =$("title").text();

    //������ȥ֮��
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
        //������΢�ź���
        wx.onMenuShareAppMessage({
            title: share_title,
            desc: share_desc,
            link: lc,
            imgUrl: share_imgUrl
        });
        //������QQ
        wx.onMenuShareQQ({
            title: share_title,
            desc: share_desc,
            link: lc,
            imgUrl: share_imgUrl
        });
        //������QQ΢��
        wx.onMenuShareWeibo({
            title: share_title,
            desc: share_desc,
            link: lc,
            imgUrl: share_imgUrl
        });
    })



    //��㷽��
    var statPoint = function(more,callback){
        var navi = window.navigator;
        var ua = navigator.appVersion;
        var mid = getUrlString('mid');
        var ph = getUrlString('ph')|| phoneName();
        var os = getUrlString('pf') || sys();
        var id = getUrlString("id");
        var version = navi.appVersion.substr(ua.indexOf('version/')+8,4);
        var ov = version=='cint' ? '' : version;
        var mac = getUrlString('mac');
        var rs = getUrlString('res') ||  window.screen.width+'*'+window.screen.height;
        var net = getUrlString('net');
        var uid = getUrlString('uid');
        var ch = getUrlString('channel');
        var cid = getUrlString('cid');
        var ver = getUrlString('ver');
        var rc = getUrlString("rc");
        var rcc = getUrlString("rcc");
        var pro = getUrlString("pro");
        var uuid = getUrlString("uuid");
        var myDate = Math.round(new Date() / 1000);//ʱ�������Ҫ����ͳ�ƺ�̨
        var url = 'http://d.happyjuzi.com:8011/in';
        var data = 'head?pro=juzi&uid='+id+'&mid='+mid+'&ver='+ver+'&mac='+mac+'&cid='+cid+"&pro="+pro+'&ph='+ph+"&uuid="+uuid+"&ov="+ov+"&os="+os+'&rs='+rs+'&net='+net+'&ch='+ch+"&rc="+rc+"&rcc="+rcc+"&tm="+myDate+more;
        $.ajax({
            type: 'POST',
            url: url,
            data: {"data":data},
            dataType: 'text',
            jsonp: "callback",
            jsonpCallback:"success_jsonpCallback",
            success: function(){
                return true;
                //���ؽ������������������ã����ƽ�������
            },
            error: function(xhr, type){
                console.log('Ajax error!');
            },
            complete:function(){
                if(typeof callback == 'function'){
                    callback()
                }else{
                    callback;
                }

            }
        })
    }
    //��ȡURL����
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
    //�ж��ֻ�����
    function phoneName(){
        var reg = /\(.*?\)/;
        var system = navigator.userAgent.toLowerCase().replace(/\s/g, '').match(reg)[0];
        var system = system.slice(1, system.length - 1);
        var os;
        function f1(str, flag) {
            var reg = /(\w{0,}\d{0,})+([/])/g;
            if (flag) {
                var str1 = str.match(reg)[0];
                os = str1.replace('build/', '');
                return os;
            } else {
                if(/nokia/.test(str)){
                    os = (function(cont){
                        var s = '',conts = cont.length;
                        for(var i = 0;i<conts;i++){
                            if(s.indexOf(";") > 0){
                                return s.split(";")[1]
                            }else{
                                s+=cont.substring(conts,conts-i)
                            }
                        }
                    })(str)

                }else{
                    os = str.indexOf(';') > 0 ? str.split(';')[0] : str;
                }
                return os;
            }
        }
        system.indexOf('build/') > 0 ? f1(system, true) : f1(system, false);
        console.log(os);
        // alert(os)
        return os;
    }
    //�ж��ֻ�ϵͳ
    function sys() {
        var nav = navigator.userAgent.toLowerCase().replace(/\s/g, "");
        var sys = ['iphone', 'android', "ipad", "windowsphone", "meego"];
        var system;
        if (/iphone|android|ipad|windowsphone|meego/.test(nav)) {
            for (var i = 0; i < sys.length; i++) {
                if (nav.indexOf(sys[i]) > 0) {
                    system = sys[i];
                    break;
                }
            }
        } else {
            system = 'other';
        }

        if (system == 'iphone' || system == 'ipad') {
            system = 'ios';
        } else if (system == 'other') {
            system = 'other';
        }

        console.log(system);
        return system;
    }


    //�ж����ް�װapp
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
            //$(".shareDownbtn").attr("href", "https://itunes.apple.com/us/app/ju-zi-yu-le/id931179407?ls=1&mt=8");
            window.location.href = "https://itunes.apple.com/us/app/ju-zi-yu-le/id931179407?ls=1&mt=8";
        }else if(ua.indexOf("android") > -1){
            //$(".shareDownbtn").attr("href", "http://files01.happyjuzi.com/juzi/apk/v1.0/juzi-juzi-release.apk");
            window.location.href = "http://files01.caoooo.cn/apk/orange-release-juzi2.apk";
        }
    }
    $(".shareDownbtn").click(function() {
        var _this = $(this);
        var dl2 = 'func?mod=dl&fuid='+getUrlString('fromuid');
        statPoint(dl2,null);
        setTimeout(function(){
            if (ua.indexOf("micromessenger") > -1) {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.happyjuzi.apps.juzi";
            }else{
                if(_this.attr('class').indexOf("installed")> -1 || _this.hasClass('installed')){
                    tryOpenApps();
                }else{
                    downloadApp();
                }
            }
        },500)
    })






})(Zepto)