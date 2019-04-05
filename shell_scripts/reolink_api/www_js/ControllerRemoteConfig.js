/**
 * class ControllerRemoteConfig
 * 提供远程配置界面的控制接口。
 */
function ControllerRemoteConfig() {
	throw {"msg": "Don't NEW a singleton,"};
}

EventListener.apply(ControllerRemoteConfig);

(function() {
	var _curPage = null;

    ControllerRemoteConfig.showLoadWaiter = function() {
        ControllerRemoteConfig.waiter.show('Loading configurations...');
    };

    ControllerRemoteConfig.showSaveWaiter = function() {
        ControllerRemoteConfig.waiter.show('Saving configurations...');
    };

    ControllerRemoteConfig.showTestWaiter = function() {
        ControllerRemoteConfig.waiter.show('Testing configurations...');
    };

	ControllerRemoteConfig.init = function () {
        ControllerMain.on('resize', function() {
            if ($('.remote-main-view').length > 0) {
                $('.remote-main-view').css({
                    "width": $(window).innerWidth() - 250,
                    "height": $(window).innerHeight() - $('#remote-tabs').offset().top - $('#remote-tabs').outerHeight()
                });
                $('.remote-main-view').trigger('inner-resize');
                setTimeout(function() {
                    if ($('.remote-main-view').outerWidth() < $(window).innerWidth() - 250) {
                        $('.remote-main-view').css({
                            "width": $(window).innerWidth() - 250
                        });
                        $('.remote-main-view').trigger('inner-resize');
                    }
                }, 50);
            }
        });
		delete this.init;
	};

    /**
     * 加载远程配置主界面。
     */
	ControllerRemoteConfig.loadMainView = function () {
        var ld;
        if ($('#remote-config-view').length > 0) {
            return;
        }
        ControllerRemoteConfig.unbind('beforeUnload');

        ld = new WebLoader(function(vars) {
            if ($('#remote-config-view').length > 0) {
                return;
            }
            $('body').append(vars.html);
            var $obj = $('#config-tree');
            ControllerMain.showConfigPage();
            ControllerRemoteConfig.registerEvents();
            ControllerRemoteConfig.trigger('mainViewReady');
            ControllerRemoteConfig.waiter = new ViewWaiting({
                "id": "config-waiter",
                "text": "Loading..."
            });

            $('#config-tree > li:first-child li:first-child').click();
            $('.remote-main-view').css({
                "left": 250,
                "top": $('#remote-tabs').outerHeight()
            });
            $('.remote-main-view').css({
                "width": $(window).innerWidth() - 250,
                "height": $(window).innerHeight() - $('#remote-tabs').offset().top - $('#remote-tabs').outerHeight()
            });
        }, function() {
            bc_alert('Oops, remote config failed to load.', 'error');
        });

        ld.loadAjax('html', {
            "url": "htmls/config-left-tree.html?timeVersion=" + (new Date()).getTime(),
            "type": "get"
        }).loadCSS('config-css', 'css/remote-config.css');

        ld = null;

    };

    /**
     * 加载指定页面。
     */
    ControllerRemoteConfig.loadPage = function(name) {
        this.showLoadWaiter();
        var ld = new WebLoader(function(vars) {
            var $obj = $('.remote-main-view');
            var cnt = 0;
            var $inner;
            CGI.setLocation(name + (Math.random() * (new Date()).getTime()));
            ControllerRemoteConfig.trigger('beforeUnload');
            ControllerRemoteConfig.unbind('beforeUnload');
            $obj.html('');
            $obj.append(vars.html);
            eval(vars.js);
            $inner = $obj.find('#config-frame');
            _curPage = name;
            bindEnabler($obj.find('input[type=checkbox]'));
            bindShowPassword($obj.find('input[type=checkbox]'));
            bindDisabler($obj.find('input[type=checkbox]'));
            bindVisibler($obj.find('input[type=checkbox]'));
            bindInvisibler($obj.find('input[type=checkbox]'));
            bindValue2Text($obj.find('input[type=text]'))
            ControllerRemoteConfig.setupPeriodPicker($obj);
            ControllerRemoteConfig.trigger('load-' + name, [$obj]);
            $inner.before('<section></section>');
            $inner.after('<section></section>');
        }, function () {
            bc_alert('Failed to open configuration page' + name, 'error');
        });

        ld.loadAjax('html', {
            "url": "htmls/cfg-" + name + '.html?timeVersion=' + (new Date()).getTime(),
            "type": "get"
        }).loadAjax('js', {
            "url": "js/remote-configs/cfg-" + name + '.js?timeVersion=' + (new Date()).getTime(),
            "type": "get"
        });

        ld = null;
    };

    ControllerRemoteConfig.detectAbility = function (name, rights, channel) {
        if (ControllerLogin.chkPermission(name, rights, channel)) {
            $('.remote-main-view .tips').hide();
            if ($('.remote-main-view').find('.ab-enable-' + name).length > 0) {
                $('.remote-main-view').find('.ab-enable-' + name).show();
            }
            return true;
        } else {
            $('.remote-main-view .tips').show();
            if ($('.remote-main-view').find('.ab-enable-' + name).length > 0) {
                $('.remote-main-view').find('.ab-enable-' + name).hide();
            }
            return false;
        }
    };

    ControllerRemoteConfig.resetWritable = function (names) {

        for (var i = 0; i < names.length; ++i) {
            var name = names[i];
            var $sels = $('.remote-main-view').find('.ab-enable-' + name);
            $sels.find('select').removeAttr('disabled');
            $sels.find('input').removeAttr('disabled');
            $sels.find('button').removeAttr('disabled');
            $sels.find('.ui-slider').slider({'disabled': false});
            $('.remote-main-view .cfg-commiter input').attr('disabled', true);
        }
    };

    ControllerRemoteConfig.detectWritable = function (names, channel) {
        var cnt = names.length;
        for (var i = 0; i < names.length; ++i) {
            var name = names[i];
            var $sels = $('.remote-main-view').find('.ab-enable-' + name);
            if (!ControllerLogin.chkPermission(name, 'write', channel)) {
                $sels.find('select').attr('disabled', true);
                $sels.find('input').attr('disabled', true);
                $sels.find('button').attr('disabled', true);
                $sels.find('.ui-slider').slider({'disabled': true});
                
                cnt--;
            } else {
                $sels.find('select').removeAttr('disabled');
                $sels.find('input').removeAttr('disabled');
                $sels.find('button').removeAttr('disabled');
                $sels.find('.ui-slider').slider({'disabled': false});
            }
        }
        if (cnt > 0) {
            $('.remote-main-view .cfg-commiter input').removeAttr('disabled');
        } else {
            $('.remote-main-view .cfg-commiter input').attr('disabled', true);
        }
        return cnt;
    };

    ControllerRemoteConfig.defaultErrorHandle = function(cmd, errno, msg) {
        ControllerRemoteConfig.waiter.hide();
        CGI.autoErrorHandler(cmd, errno, msg);
    };

    /**
     * 给左侧菜单绑定事件
     */
    ControllerRemoteConfig.registerEvents = function () {
        $('#config-tree > li > p').on('click', function () {
            if (!$(this).parent().hasClass('expended')) {
                $('#config-tree > li.expended').removeClass('expended');
                $(this).parent().addClass('expended');
            }
        });
        $('.config-tree li').on('click', function () {
            if (!$(this).hasClass('selected')) {
                $('.config-tree li.selected').removeClass('selected');
                $(this).addClass('selected');
                $('#remote-tabs > *').remove();
                $(this).find('tab-define').each(function() {
                    $('#remote-tabs').append('<div page-id="' + $(this).attr('id') + '" id="tab-' + $(this).attr('id') + '">' + $(this).text() + '</div>');
                });
                $('#remote-tabs > div:first-child').click();
            }
        });
        $('#remote-tabs').on('click', 'div', function() {
            if (!$(this).hasClass('selected')) {
                $('#remote-tabs .selected').removeClass('selected');
                $(this).addClass('selected');
                ControllerRemoteConfig.loadPage($(this).attr('page-id'));
            }
        });
    };

    ControllerRemoteConfig.setupPeriodPicker = function($obj) {
        $obj.find('.bc-period-picker').each(function() {
            initPeriodPicker($(this));
        });
    };

    ControllerRemoteConfig.setupSlider = function($obj) {
        $obj.find('.bc-ctrl-slider').each(function() {
            $(this).slider({
            	min: 1,
		      	max: 50,
		      	value: 10
		    });
		    $(this).bind('slidechange',function(event,ui){
		    	var id = $(this).attr("id");
		    	refresh(id);
		    }).trigger('slidechange');
        });
        $obj.find('.bc-ctrl-advanced-slider').each(function() {
            $(this).slider({
            	min: 0,
		      	max: 255,
		      	value: 128
		    });
		    $(this).bind('slidechange',function(event,ui){
		    	var id = $(this).attr("id");
		    	refresh(id);
		    }).trigger('slidechange');
        });
    };
	
})();

function refresh(id){
	var slider = $("#"+id).slider('value');
	$("#"+id+"-text").text(slider);
}

function osdGetItemPosition(x, y){
    return y + ' ' + x;
}

function osdGetItemPositionValue(index){
    var tmp = index.split(' ');
    return {
        "x" : tmp[1],
        "y" : tmp[0]
    };
}
