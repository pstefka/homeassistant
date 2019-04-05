/**
 * PlayerPreview 类负责 预览界面的播放控制
 */
function PlayerPreview() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(PlayerPreview);

(function() {

    PlayerPreview.setVolume = function(v) {
        $('#preview_sound_slid').slider2({
            "value": v
        });
        window.localStorage.setItem("/player/preview/volume", v);
    };

    PlayerPreview.getVolume = function(v) {
        return $('#preview_sound_slid').slider2('value');
    };

    PlayerPreview.constructRTMPUrl = function(chId, streamType) {
        var streamShortNames = [
            'sub', 'ext', 'main', 'main'
        ];

        if (ControllerLogin.abilities.abilityChn[chId] && ControllerLogin.abilities.abilityChn[chId].live.ver == 2) {

            if (streamType === EnumStreamType.BALANCED) {
                streamType = EnumStreamType.FLUENT;
            }
        }

        var url = 'rtmp://' + window.location.hostname + ':' + ControllerFlash.rtmpPort + '/bcs/channel' + chId + '_' + streamShortNames[streamType] + '.bcs' +
            '?token=' + ControllerLogin.token +
            '&channel=' + chId +
            '&stream=' + EnumRTMPStreamType[streamType];
        console.dbg('PlayerPreview.constructRTMPUrl:', url);
        return url;
    }

    PlayerPreview.init = function() {

        this.waiter = new ViewWaiting({
            "id": "pv-waiter"
        });

        this.sliderIsMouseDown = false;

        this.previewSoundVal = 0;

        this.previewStreamSel = EnumStreamType.FLUENT;

        this.streanIntervalId = 0;
        this.extendIntervalId = 0;
        this.isShow = true;

        this.rightSections = []; // real show items

        this.allRightSections = []; // all right view items

        this.isRightViewShow = true;

        this.presetListItemSel = 0;

        this.trigger('init');

        this.initEvents();

        this.initPreviewRightData();

        ViewPTZAction.initUI && ViewPTZAction.initUI();

        ViewPTZPreset.initUI && ViewPTZPreset.initUI();

        ViewEncode.initUI && ViewEncode.initUI();

        ViewOSD.initUI && ViewOSD.initUI();

        ViewImage.initUI && ViewImage.initUI();

        ViewISP.initUI && ViewISP.initUI();

        $('.pre_head_titile').on('click', function() {
            var selView = ViewManager.getSelectedView();
            if (ViewManager.getMode() != 'PREVIEW' || !selView) {
                return;
            }

            if ($(this).parent().parent().height() < 50 && !PlayerPreview.isRefreshingRightBar) {
                $('#view-block-PREVIEW-' + selView.getId() + '-toolbar').click();
            }
        });

        delete this.init;
    };

    PlayerPreview.initEvents = function() {

        PlayerPreview.streamSelectorTimerId = false;

        // 全部播放按钮
        $('#preview_button_start').on('click', function() {
            if ($('.popover-content #pv-stream-selector').length > 0) {
                return;
            }

            if (PlayerPreview.streamSelectorTimerId) {
                clearInterval(PlayerPreview.streamSelectorTimerId);
            }

            PlayerPreview.streamSelectorTimerId = setInterval(function() {

                if (false === PlayerPreview.streamSelectorTimerId) {
                    return;
                }

                if ($('#preview_button_start:hover').length == 1 || $('#pv-stream-selector .pb_play_start_pop_a:hover').length > 0) {
                    return;
                }

                if ($('.popover-content #pv-stream-selector').length > 0) {
                    $('#preview_button_start').click();
                }

                clearInterval(PlayerPreview.streamSelectorTimerId);
                PlayerPreview.streamSelectorTimerId = false;

            }, 3000);
        }).popover({
            html: true,
            trigger: "click",
            placement: 'top',
            content: function() {

                return $('#preview_play_popover').html();
            }
        });

        $("body").on("click", "a#preview_play_mainstream", function() {
            PlayerPreview.trigger('playAllStream', [EnumStreamType.CLEAR]);
        });

        $("body").on("click", "a#preview_play_balancestream", function() {
            PlayerPreview.trigger('playAllStream', [EnumStreamType.BALANCED]);
        });

        $("body").on("click", "a#preview_play_substream", function() {
            PlayerPreview.trigger('playAllStream', [EnumStreamType.FLUENT]);
        });

        $("body").on("click", "a#preview_play_auto", function() {
            PlayerPreview.trigger('playAllStream', [EnumStreamType.AUTO]);
        });

        // 全部暂停按钮
        $("#preview_stopall_button").click(function() {
            PlayerPreview.trigger('stopAllStream');
        });

        // default button

        $("#preview_default_button").click(function() {
            PlayerPreview.trigger('setDefaultHSB');
        });

        $("#channels_control_head").click(PlayerPreview.onRightHeadClick);

        $("#ptz_control_head").click(PlayerPreview.onRightHeadClick);

        $("#pre_img_control_head").click(PlayerPreview.onRightHeadClick);

        $("#advanced_control_head").click(PlayerPreview.onRightHeadClick);

        delete this.initEvents;
    };

    PlayerPreview.reload = function() {
        PlayerPreview.initRightViewPos();
        ViewManager.updateView();

        ViewPTZPreset.refreshPresetMenuSel();

        ViewManager.showScreenByChannels();
        PlayerPreview.showPTZByDevice();
        PlayerPreview.initPreviewPop();
    };


    PlayerPreview.initPreviewRightData = function() {
        // only init once
        var channelsView = document.getElementById("preview_channels_views");
        var channelsHeaderView = document.getElementById("pre_channels_arrows");
        var ptzView = document.getElementById("pre_ptz_container");
        var ptzHeaderView = document.getElementById("pre_ptz_arrows");
        var imgView = document.getElementById("pre_img_container");
        var imgHeaderView = document.getElementById("pre_img_arrows");
        var advanceView = document.getElementById("pre_advanced_container");
        var advHeaderView = document.getElementById("pre_adv_arrows");

        var previewChannelsItem = new PreviewCtrolItem();
        previewChannelsItem.name = EnumPreRightItem.CHANNELS;
        previewChannelsItem.containerView = channelsView;
        previewChannelsItem.headerView = channelsHeaderView;
        previewChannelsItem.maxHeight = channelsView.offsetHeight;
        previewChannelsItem.isShow = true;

        PlayerPreview.allRightSections[0] = previewChannelsItem;

        var previewPTZItem = new PreviewCtrolItem();
        previewPTZItem.name = EnumPreRightItem.PTZ;
        previewPTZItem.containerView = ptzView;
        previewPTZItem.headerView = ptzHeaderView;
        previewPTZItem.maxHeight = ptzView.offsetHeight;
        previewPTZItem.isShow = true;

        PlayerPreview.allRightSections[1] = previewPTZItem;

        var previewImgItem = new PreviewCtrolItem();
        previewImgItem.name = EnumPreRightItem.IMG;
        previewImgItem.containerView = imgView;
        previewImgItem.headerView = imgHeaderView;
        previewImgItem.maxHeight = imgView.offsetHeight;
        previewImgItem.isShow = true;

        PlayerPreview.allRightSections[3] = previewImgItem;

        var previewAdvItem = new PreviewCtrolItem();
        previewAdvItem.name = EnumPreRightItem.ADV;
        previewAdvItem.containerView = advanceView;
        previewAdvItem.headerView = advHeaderView;
        previewAdvItem.maxHeight = advanceView.offsetHeight;
        previewAdvItem.isShow = true;

        PlayerPreview.allRightSections[4] = previewAdvItem;

        $('#basic_setting_header > span').on('click', function() {
            $('#basic_setting_header .selected').removeClass('selected');
            $(this).addClass('selected');
            $('.basic_setting_box.visible').removeClass('visible');
            $('#' + $(this).attr('bc-bind-id')).addClass('visible');
        });
    };

    PlayerPreview.initRightViewPos = function() {

        PlayerPreview.rightSections = [];

        var viewObj = ViewManager.getSelectedView();
        var ch;
        if (ControllerMain.deviceInfo.channelNum > 1) {

            $("#preview_channels_views").show();
            PlayerPreview.rightSections
                .push(PlayerPreview.allRightSections[0]);
        } else {

            $("#preview_channels_views").hide();
        }

        if (viewObj && viewObj.getChannelId() !== null) {

            if (ControllerLogin.chkPermission('ptzCtrl', 'exec', 0)) {

                $("#pre_ptz_container").show();
                PlayerPreview.rightSections.push(PlayerPreview.allRightSections[1]);
            } else {
                $("#pre_ptz_container").hide();
            }

        }
        PlayerPreview.rightSections.push(PlayerPreview.allRightSections[3]);

        $("#pre_advanced_container").show();
        PlayerPreview.rightSections.push(PlayerPreview.allRightSections[4]);

        for (var i = 0; i < PlayerPreview.rightSections.length; ++i) {

            if (0 == i) {

                PlayerPreview.rightSections[i].containerView.style.top = 0 + 'px';
            } else {
                var curViewTop = 0;
                for (var j = 1; j < i + 1; j++) {

                    if (PlayerPreview.rightSections[j - 1].isShow) {

                        curViewTop += PlayerPreview.rightSections[j - 1].maxHeight;
                    } else {

                        curViewTop += 30;
                    }
                }
                PlayerPreview.rightSections[i].containerView.style.top = curViewTop +
                    'px';
            }
        }

        $("#ptz_control_head").click();

    };

    PlayerPreview.redrawRightView = function(chId) {

        var ptType = ControllerLogin.abilities.abilityChn[chId].ptzType.ver;
        switch (ptType) {
            case EnumPTZType.AF:
                $('#ptz_base_focus_reduce').attr("style", "");
                [
                    'pre_preset_preset_container',
                    'ptz_dir_control_container',
                    'pre_preset_cruise_container',
                    'ptz_base_iris_reduce',
                    'ptz_base_iris_image',
                    'ptz_base_iris_add'
                ].forEach(function(v) {
                    $('#' + v).hide();
                });
                ['prev_preset_menu_container', 'ptz_speed'].forEach(function(v) {
                    $('.' + v).hide();
                });
                [
                    'ptz_base_zoom_reduce',
                    'ptz_base_zoom_image',
                    'ptz_base_zoom_add',
                    'ptz_base_focus_reduce',
                    'ptz_base_focus_image',
                    'ptz_base_focus_add'
                ].forEach(function(v) {
                    $('#' + v).show();
                });
                $('#ptz_base_control_container').css({
                    "float": "none",
                    "margin-left": "auto",
                    "margin-right": "auto",
                    "margin-top": "0px",
                    "width": "95%"
                });
                $('#ptz_base_focus_reduce').css({
                    "margin-left": 16
                });
                PlayerPreview.allRightSections[1].maxHeight = 108;
                $('#ptz-title').text('Optical Zoom');
                break;
            case EnumPTZType.PT:
                $('#ptz_base_control_container').attr("style", "margin-top: 33px;");
                $('#ptz_base_focus_reduce').attr("style", "");
                [
                    'pre_preset_preset_container',
                    'ptz_dir_control_container'
                ].forEach(function(v) {
                    $('#' + v).show();
                });
                $('#ptz_dir_control_container').css({ 'margin-left': 60 });
                [
                    'ptz_base_zoom_reduce',
                    'ptz_base_zoom_image',
                    'ptz_base_zoom_add',
                    'ptz_base_focus_reduce',
                    'ptz_base_focus_image',
                    'ptz_base_focus_add',
                    'ptz_base_iris_reduce',
                    'ptz_base_iris_image',
                    'ptz_base_iris_add',
                    'pre_preset_cruise_container',
                    'pre_preset_menu_cruise_view',
                    'ptz_base_control_container'
                ].forEach(function(v) {
                    $('#' + v).hide();
                });
                $('.ptz_speed').hide();
                $('.prev_preset_menu_container').css({ 'visibility': 'hidden', 'margin-top': '-40px' });
                PlayerPreview.allRightSections[1].maxHeight = 410;
                $('#ptz-title').text('PTZ');
                break;
            case EnumPTZType.PTZ:
            case EnumPTZType.PTZS:
                $('#ptz_base_control_container').attr("style", "");
                $('#ptz_base_focus_reduce').attr("style", "");
                [
                    'ptz_base_zoom_reduce',
                    'ptz_base_zoom_image',
                    'ptz_base_zoom_add',
                    'ptz_base_focus_reduce',
                    'ptz_base_focus_image',
                    'ptz_base_focus_add',
                    'ptz_base_iris_reduce',
                    'ptz_base_iris_image',
                    'ptz_base_iris_add',
                    'pre_preset_preset_container',
                    'ptz_dir_control_container',
                    'ptz_base_control_container'
                ].forEach(function(v) {
                    $('#' + v).show();
                });
                $('#pre_preset_cruise_container').hide();
                ['prev_preset_menu_container', 'ptz_speed'].forEach(function(v) {
                    $('.' + v).show();
                });
                PlayerPreview.allRightSections[1].maxHeight = 450;
                $('#ptz-title').text('PTZ');
                break;
            case EnumPTZType.GM8136S_PTZ:
                $('#ptz_base_control_container').attr("style", "");
                $('#ptz_base_focus_reduce').attr("style", "");
                [
                    'ptz_base_zoom_reduce',
                    'ptz_base_zoom_image',
                    'ptz_base_zoom_add',
                    'ptz_base_focus_reduce',
                    'ptz_base_focus_image',
                    'ptz_base_focus_add',
                    'pre_preset_preset_container',
                    'ptz_dir_control_container',
                    'ptz_base_iris_reduce',
                    'ptz_base_iris_image',
                    'ptz_base_iris_add'
                ].forEach(function(v) {
                    $('#' + v).show();
                });
                $('#pre_preset_cruise_container').hide();
                ['prev_preset_menu_container'].forEach(function(v) {
                    $('.' + v).show();
                });
                $('.ptz_speed').hide();
                PlayerPreview.allRightSections[1].maxHeight = 410;
                $('#ptz-title').text('PTZ');
                $("#slider_ptz_speed").slider({
                    "value": 10
                });
                break;
        }
        if (ControllerLogin.chkVersion("ptzPatrol", EnumPatrolType.NONE, chId)) {
            $('#pre_preset_menu_preset_view').click();
            if (ptType !== EnumPTZType.AF) {
                PlayerPreview.allRightSections[1].maxHeight -= 30;
            }
            $('.prev_preset_menu_container').hide();
        } else {
            $('.prev_preset_menu_container').show();
        }
        var minHeight = 30;
        for (var i = 0; i < PlayerPreview.rightSections.length; ++i) {

            var maxHeight = PlayerPreview.rightSections[i].maxHeight;
            if (PlayerPreview.rightSections[i].isShow) {
                PlayerPreview.extendView(i, PlayerPreview.rightSections, maxHeight);
            } else {
                PlayerPreview.strenView(i, PlayerPreview.rightSections, minHeight);
            }
        }
    };

    PlayerPreview.onRightHeadClick = function() {
        var minHeight = 30;
        for (var i = 0; i < PlayerPreview.rightSections.length; ++i) {

            var maxHeight = PlayerPreview.rightSections[i].maxHeight;
            if (EnumPreRightItem[$(this).attr('contain-name')] == PlayerPreview.rightSections[i].name) {
                PlayerPreview.extendClick(i,
                    PlayerPreview.rightSections,
                    minHeight, maxHeight);
            } else if (PlayerPreview.rightSections[i].isShow) {
                PlayerPreview.extendClick(i,
                    PlayerPreview.rightSections,
                    minHeight, maxHeight);
            }
        }
    };

    // extend view click

    PlayerPreview.extendClick = function(clickWitch, controlViews, minHeight, maxHeight) {

        var previewCtrolItem = controlViews[clickWitch];
        if (previewCtrolItem.isShow) {

            previewCtrolItem.isShow = false;
            PlayerPreview.strenView(clickWitch, controlViews, minHeight);
        } else {

            previewCtrolItem.isShow = true;
            PlayerPreview.extendView(clickWitch, controlViews, maxHeight);
        }
    };

    PlayerPreview.strenView = function(clickWitch, controlViews, minHeight) {
        var controlView = controlViews[clickWitch].containerView;
        var headerView = controlViews[clickWitch].headerView;
        headerView.className = "pre_head_arrows header_arrows_stren";
        var itemViewHeights = new Array();

        for (var i = 0; i < controlViews.length; ++i) {

            var itemView = controlViews[i].containerView;
            if (clickWitch == i) {

                itemViewHeights.push(minHeight);
            } else {

                itemViewHeights.push(itemView.offsetHeight);
            }
        }

        for (var j = 0; j < controlViews.length; ++j) {

            var $itemView = $(controlViews[j].containerView);
            if (clickWitch == j) {

                $itemView.css({
                    height: minHeight
                });
            } else if (j > clickWitch) {

                var itemTop = 0
                for (var k = 0; k < itemViewHeights.length; ++k) {

                    if (k < j) {

                        itemTop = itemTop + itemViewHeights[k];
                    }
                }
                $itemView.css({
                    top: itemTop
                });
            }

        }
    };

    PlayerPreview.extendView = function(clickWitch, controlViews, maxHeight) {

        var controlView = controlViews[clickWitch].containerView;
        var headerView = controlViews[clickWitch].headerView;
        headerView.className = "pre_head_arrows header_arrows_extend";
        var itemViewHeights = new Array();

        for (var i = 0; i < controlViews.length; ++i) {

            var itemView = controlViews[i].containerView;
            if (clickWitch == i) {

                itemViewHeights.push(maxHeight);
            } else {

                itemViewHeights.push(itemView.offsetHeight);
            }
        }

        for (var j = 0; j < controlViews.length; ++j) {

            var $itemView = $(controlViews[j].containerView);
            if (clickWitch == j) {

                $itemView.css({
                    height: maxHeight
                });
            } else if (j > clickWitch) {

                var itemTop = 0
                for (var k = 0; k < itemViewHeights.length; ++k) {

                    if (k < j) {

                        itemTop = itemTop + itemViewHeights[k];
                    }
                }
                $itemView.css({
                    top: itemTop
                });
            }

        }

    };

    PlayerPreview.previewChangePlayStreamSel = function(sel) {
        PlayerPreview.previewStreamSel = parseInt(sel);
        $('.pb_play_start_pop_div .selected').removeClass('selected');

        clearInterval(PlayerPreview.streamSelectorTimerId);
        PlayerPreview.streamSelectorTimerId = false;

        switch (sel) {
            case EnumStreamType.CLEAR:
                $("#preview_play_mainstream").addClass('selected');
                break;
            case EnumStreamType.FLUENT:
                $("#preview_play_substream").addClass('selected');
                break;
            case EnumStreamType.BALANCED:
                $("#preview_play_balancestream").addClass('selected');
                break;
            case EnumStreamType.AUTO:
                $("#preview_play_auto").addClass('selected');
                break;
        }

    };

    PlayerPreview.initPreviewPop = function() {
        PlayerPreview.previewChangePlayStreamSel(PlayerPreview.previewStreamSel);
        if (null != g_device && g_device.isIPC) {

            $("#preview_sub_auto_divider").hide();
            $("#preview_play_auto").hide();
        } else {

            $("#preview_sub_auto_divider").show();
            $("#preview_play_auto").show();
        }
    };


    /*
     * preview stream change callback
     * 
     */
    PlayerPreview.streamDidChangeCallback = function() {

        $('#channelItems > .CH_btn-group').each(function() {
            var channel = parseInt($(this).attr('bc-channel-id'));
            switch (g_channelStreamType[channel]) {
                case EnumStreamType.CLEAR:
                    $(this).find('.text_right').text('C');
                    break;
                case EnumStreamType.BALANCED:
                    $(this).find('.text_right').text('B');
                    break;
                case EnumStreamType.FLUENT:
                    $(this).find('.text_right').text('F');
                    break;
                case EnumStreamType.AUTO:
                    $(this).find('.text_right').text('A');
                default:
                    break;
            }
        });

    };

    PlayerPreview.showPTZByDevice = function() {

        if (g_device.hasPtz) {

            $("#preview_ptz_layout").show();
            $("#OSDContainer").css({
                "top": "326"
            });
        } else {

            $("#preview_ptz_layout").hide();
            $("#OSDContainer").css({
                "top": "0"
            });
        }
    };



})();



/**
 * ViewOSD 类负责预览界面的 OSD 控制
 */
function ViewOSD() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ViewOSD);

(function() {

    ViewOSD.refreshView = function() {

        var ch = ControllerFlash.getSelectedChannelInfo();
        ControllerMain.disableAbility('osd');
        if (!ch) {
            return;
        }
        ControllerMain.enableAbility('osd');

        var d = ch.data.osd;
        if (d.osdChannel.enable != $('#osd-name-select').is(':checked')) {
            setTimeout(function() {
                $('#osd-name-select').click();
            }, 100);
        }
        $('#osd-name').attr('maxlength', ch.limits.osd.osdChannel.name.maxLen).val(d.osdChannel.name);
        $("#osd-name-postion-settings-select").html('');
        $(ch.limits.osd.osdChannel.pos).each(function() {
            $("#osd-name-postion-settings-select").append('<option value="' + this + '">' + this + '</option>');
        });
        $("#osd-date-time-position-select").html('');
        $(ch.limits.osd.osdTime.pos).each(function() {
            $("#osd-date-time-position-select").append('<option value="' + this + '">' + this + '</option>');
        });
        if (d.osdTime.pos == '') {
            $('#osd-date-time-position-select').val(ch.initials.osd.osdTime.pos);
        } else {
            $('#osd-date-time-position-select').val(d.osdTime.pos);
        }
        if (d.osdChannel.pos == '') {
            $('#osd-name-postion-settings-select').val(ch.initials.osd.osdChannel.pos);
        } else {
            $('#osd-name-postion-settings-select').val(d.osdChannel.pos);
        }
        if (d.osdTime.enable != $('#osd-date-select').is(':checked')) {
            setTimeout(function() {
                $('#osd-date-select').click();
            }, 100);
        }
        $('#osd-date-time-position-select').val(d.osdTime.pos);

        if (!ControllerLogin.chkPermission('osd', 'write', ch.index)) {
            ControllerMain.disableAbility('osd');
        }

        $('#osd-name-select').click().click();
        $('#osd-date-select').click().click();

    };

    ViewOSD.initUI = function() {

        $('#osd-name-select').on('click', function() {
            if ($(this).is(':checked')) {
                $('#osd-name').removeAttr('disabled');
                $('#osd-name-postion-settings-select').removeAttr('disabled');
            } else {
                $('#osd-name').attr('disabled', true);
                $('#osd-name-postion-settings-select').attr('disabled', true);
            }
        });

        $('#osd-date-select').on('click', function() {
            if ($(this).is(':checked')) {
                $('#osd-date-time-position-select').removeAttr('disabled');
            } else {
                $('#osd-date-time-position-select').attr('disabled', true);
            }
        });

        $('#preview-commit-osd').on('click', function() {

            if (!$('#osd-name').val().match(/^[\x00-\x7F]+$/)) {
                bc_alert('Camera name can only consist of alphabet or digtal charactors.', 'error');
                return;
            }

            var viewObj = ViewManager.getSelectedView();
            if (viewObj.getChannelId() == null) {
                return;
            }
            var chObj = ChannelManager.get(viewObj.getChannelId());

            if ($('#osd-name-postion-settings-select').val() == $('#osd-date-time-position-select').val()) {
                if ($('#osd-name-select').is(':checked') && $('#osd-date-select').is(':checked')) {
                    bc_alert('Don\'t select a same position for both date and OSD.', 'error');
                    return;
                }
            }

            $('#preview-commit-osd').attr('disabled', true);
            PlayerPreview.waiter.show('Saving OSD settings...');
            CGI.sendCommand('SetOsd', {
                "Osd": {
                    "channel": chObj.getId(),
                    "osdChannel": {
                        "name": $('#osd-name').val(),
                        "enable": $('#osd-name-select').is(':checked') ? 1 : 0,
                        "pos": $('#osd-name-postion-settings-select').val()
                    },
                    "osdTime": {
                        "enable": $('#osd-date-select').is(':checked') ? 1 : 0,
                        "pos": $('#osd-date-time-position-select').val()
                    }
                }
            }, function(d) {
                PlayerPreview.waiter.hide();
                bc_alert('OSD configured successfully.');
                $('#preview-commit-osd').removeAttr('disabled');
            }, function(cmd, errno, msg) {
                PlayerPreview.waiter.hide();
                CGI.autoErrorHandler(cmd, errno, msg);
                $('#preview-commit-osd').removeAttr('disabled');
            });
        });
    };

})();

/**
 * ViewISP 类负责预览界面的 ISP 控制
 */
function ViewISP() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ViewISP);

(function() {
    var _batchOp = false;

    ViewISP.restoreDefault = function(chId) {
        var ch = ControllerFlash.getSelectedChannelInfo();
        var fieldOptions, fieldData;

        if (!ch) {
            return; // 无选中
        }

        this.restoring = true;

        fieldOptions = ch.limits.isp;
        fieldData = ch.initials.isp;

        $('#pv-adv-channel').val(fieldData.channel);

        $('#pv-gain-begin').val(fieldData.gain.min);
        $('#pv-gain-end').val(fieldData.gain.max);

        $('#pv-shutter-begin').val(fieldData.shutter.min);
        $('#pv-shutter-end').val(fieldData.shutter.max);

        $('#pv-red-gain').slider({
            "min": fieldOptions.redGain.min,
            "max": fieldOptions.redGain.max,
            "value": fieldData.redGain
        });

        $('#pv-blue-gain').slider({
            "min": fieldOptions.blueGain.min,
            "max": fieldOptions.blueGain.max,
            "value": fieldData.blueGain
        });

        $('#pv-gain-begin').attr({
            "max": fieldOptions.gain.max,
            "min": fieldOptions.gain.min,
            "title": fieldOptions.gain.min + '~' + fieldOptions.gain.max
        }).val(fieldData.gain.min);

        $('#pv-gain-end').attr({
            "max": fieldOptions.gain.max,
            "min": fieldOptions.gain.min,
            "title": fieldOptions.gain.min + '~' + fieldOptions.gain.max
        }).val(fieldData.gain.max);

        $('#pv-shutter-begin').attr({
            "max": fieldOptions.shutter.max,
            "min": fieldOptions.shutter.min,
            "title": fieldOptions.shutter.min + '~' + fieldOptions.shutter.max
        }).val(fieldData.shutter.min);

        $('#pv-shutter-end').attr({
            "max": fieldOptions.shutter.max,
            "min": fieldOptions.shutter.min,
            "title": fieldOptions.shutter.min + '~' + fieldOptions.shutter.max
        }).val(fieldData.shutter.max);

        $('#pv-blc').slider({
            "min": fieldOptions.blc.min,
            "max": fieldOptions.blc.max,
            "value": fieldData.blc
        });

        $('#pv-drc').slider({
            "min": fieldOptions.drc.min,
            "max": fieldOptions.drc.max,
            "value": fieldData.drc
        });

        if ($('#pv-3d-nr').is(':checked') != fieldData.nr3d) { $('#pv-3d-nr').click(); }

        $('#pv-anti-flicker').html('');
        $(fieldOptions.antiFlicker).each(function() {
            $('#pv-anti-flicker').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-anti-flicker').val(fieldData.antiFlicker);

        $('#pv-exposure').html('');
        $(fieldOptions.exposure).each(function() {
            $('#pv-exposure').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-exposure').val(fieldData.exposure).trigger('change');

        $('#pv-exposure').html('');
        $(fieldOptions.exposure).each(function() {
            $('#pv-exposure').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-exposure').val(fieldData.exposure).trigger('change');

        $('#pv-white-balance').html('');
        $(fieldOptions.whiteBalance).each(function() {
            $('#pv-white-balance').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-white-balance').val(fieldData.whiteBalance).trigger('change');

        $('#pv-backlight').html('');
        var EnumBackLightNames = {
            "DynamicRangeControl": "Dynamic Range",
            "BackLightControl": "Back-Light",
            "Off": "Off"
        };

        $(fieldOptions.backLight).each(function() {
            $('#pv-backlight').append('<option value="' + this + '">' + EnumBackLightNames[this] + '</option>');
        });
        $('#pv-backlight').val(fieldData.backLight).trigger('change');

        $('#pv-daynight').html('');
        $(fieldOptions.dayNight).each(function() {
            $('#pv-daynight').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-daynight').val(fieldData.dayNight);

        $('#pv-adv-commit').click();

    };

    ViewISP.refreshView = function(chId) {
        var ch = ControllerFlash.getSelectedChannelInfo();
        var fieldOptions, fieldData;

        ControllerMain.disableAbility('isp');

        if (!ch) {
            return; // 无选中
        }

        ControllerMain.enableAbility('isp');

        fieldOptions = ch.limits.isp;
        fieldData = ch.data.isp;

        $('#pv-adv-channel').val(fieldData.channel);

        $('#pv-gain-begin').val(fieldData.gain.min);
        $('#pv-gain-end').val(fieldData.gain.max);

        $('#pv-shutter-begin').val(fieldData.shutter.min);
        $('#pv-shutter-end').val(fieldData.shutter.max);

        $('#pv-red-gain').slider({
            "min": fieldOptions.redGain.min,
            "max": fieldOptions.redGain.max,
            "value": fieldData.redGain
        });

        $('#pv-blue-gain').slider({
            "min": fieldOptions.blueGain.min,
            "max": fieldOptions.blueGain.max,
            "value": fieldData.blueGain
        });

        $('#pv-gain-begin').attr({
            "max": fieldOptions.gain.max,
            "min": fieldOptions.gain.min,
            "title": fieldOptions.gain.min + '~' + fieldOptions.gain.max
        }).val(fieldData.gain.min);

        $('#pv-gain-end').attr({
            "max": fieldOptions.gain.max,
            "min": fieldOptions.gain.min,
            "title": fieldOptions.gain.min + '~' + fieldOptions.gain.max
        }).val(fieldData.gain.max);

        $('#pv-shutter-begin').attr({
            "max": fieldOptions.shutter.max,
            "min": fieldOptions.shutter.min,
            "title": fieldOptions.shutter.min + '~' + fieldOptions.shutter.max
        }).val(fieldData.shutter.min);

        $('#pv-shutter-end').attr({
            "max": fieldOptions.shutter.max,
            "min": fieldOptions.shutter.min,
            "title": fieldOptions.shutter.min + '~' + fieldOptions.shutter.max
        }).val(fieldData.shutter.max);

        $('#pv-blc').slider({
            "min": fieldOptions.blc.min,
            "max": fieldOptions.blc.max,
            "value": fieldData.blc
        });

        $('#pv-drc').slider({
            "min": fieldOptions.drc.min,
            "max": fieldOptions.drc.max,
            "value": fieldData.drc
        });

        _batchOp = true;

        if ($('#pv-rotation').is(':checked') != fieldData.rotation) { $('#pv-rotation').click(); }

        if ($('#pv-mirroring').is(':checked') != fieldData.mirroring) { $('#pv-mirroring').click(); }

        _batchOp = false;

        if ($('#pv-3d-nr').is(':checked') != fieldData.nr3d) { $('#pv-3d-nr').click(); }

        $('#pv-anti-flicker').html('');
        $(fieldOptions.antiFlicker).each(function() {
            $('#pv-anti-flicker').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-anti-flicker').val(fieldData.antiFlicker);

        $('#pv-exposure').html('');
        $(fieldOptions.exposure).each(function() {
            $('#pv-exposure').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-exposure').val(fieldData.exposure).trigger('change');

        $('#pv-exposure').html('');
        $(fieldOptions.exposure).each(function() {
            $('#pv-exposure').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-exposure').val(fieldData.exposure).trigger('change');

        $('#pv-white-balance').html('');
        $(fieldOptions.whiteBalance).each(function() {
            $('#pv-white-balance').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-white-balance').val(fieldData.whiteBalance).trigger('change');

        $('#pv-backlight').html('');
        var EnumBackLightNames = {
            "DynamicRangeControl": "Dynamic Range",
            "BackLightControl": "Back-Light",
            "Off": "Off"
        };

        $(fieldOptions.backLight).each(function() {
            $('#pv-backlight').append('<option value="' + this + '">' + EnumBackLightNames[this] + '</option>');
        });
        $('#pv-backlight').val(fieldData.backLight).trigger('change');

        $('#pv-daynight').html('');
        $(fieldOptions.dayNight).each(function() {
            $('#pv-daynight').append('<option value="' + this + '">' + this + '</option>');
        });
        $('#pv-daynight').val(fieldData.dayNight);

        if (!ControllerLogin.chkPermission('isp', 'write', ch.index)) {
            ControllerMain.disableAbility('isp');
        }
    };

    ViewISP.initUI = function() {

        $('#pv-blc').slider({
            "range": "min",
            "value": 50,
            "min": 0,
            "max": 100
        });

        $('#pv-drc').slider({
            "range": "min",
            "value": 50,
            "min": 0,
            "max": 100
        });

        $('#pv-blue-gain').slider({
            "range": "min",
            "value": 50,
            "min": 0,
            "max": 100
        });

        $('#pv-red-gain').slider({
            "range": "min",
            "value": 50,
            "min": 0,
            "max": 100
        });

        $('#pv-adv-default').on('click', function() {
            ViewISP.restoreDefault(parseInt($('#pv-adv-channel').val()));
        });

        $('#pv-gain-begin').on('change', function() {
            var vB = parseInt($(this).val()),
                vE = parseInt($('#pv-gain-end').val());
            if (vB > vE) {
                $('#pv-gain-end').val(vB);
            }
        });

        $('#pv-gain-end').on('change', function() {
            var vB = parseInt($('#pv-gain-begin').val()),
                vE = parseInt($(this).val());
            if (vB > vE) {
                $('#pv-gain-begin').val(vE);
            }
        });

        $('#pv-shutter-begin').on('change', function() {
            var vB = parseInt($(this).val()),
                vE = parseInt($('#pv-shutter-end').val());
            if (vB > vE) {
                $('#pv-shutter-end').val(vB);
            }
        });

        $('#pv-shutter-end').on('change', function() {
            var vB = parseInt($('#pv-shutter-begin').val()),
                vE = parseInt($(this).val());
            if (vB > vE) {
                $('#pv-shutter-begin').val(vE);
            }
        });

        $('#pv-adv-commit').on('click', function() {
            $(this).attr('disabled', true);
            var id = parseInt($('#pv-adv-channel').val());
            if (id < 0) {
                return bc_alert('Please select a view firstly.', 'error');
            }

            if (ViewISP.restoring) {
                PlayerPreview.waiter.show('Restoring advanced settings...');
            } else {
                PlayerPreview.waiter.show('Saving advanced settings...');
            }

            CGI.sendCommand('SetIsp', {
                "Isp": {
                    "channel": id,
                    "antiFlicker": $('#pv-anti-flicker').val(),
                    "exposure": $('#pv-exposure').val(),
                    "gain": {
                        "min": parseInt($('#pv-gain-begin').val()),
                        "max": parseInt($('#pv-gain-end').val())
                    },
                    "shutter": {
                        "min": parseInt($('#pv-shutter-begin').val()),
                        "max": parseInt($('#pv-shutter-end').val())
                    },
                    "blueGain": parseInt($('#pv-blue-gain').slider('value')),
                    "redGain": parseInt($('#pv-red-gain').slider('value')),
                    "whiteBalance": $('#pv-white-balance').val(),
                    "dayNight": $('#pv-daynight').val(),
                    "backLight": $('#pv-backlight').val(),
                    "blc": parseInt($('#pv-blc').slider('value')),
                    "drc": parseInt($('#pv-drc').slider('value')),
                    "rotation": $('#pv-rotation').is(':checked') ? 1 : 0,
                    "mirroring": $('#pv-mirroring').is(':checked') ? 1 : 0,
                    "nr3d": $('#pv-3d-nr').is(':checked') ? 1 : 0
                }
            }, function() {
                PlayerPreview.waiter.hide();
                bc_alert();
                $('#pv-adv-commit').removeAttr('disabled');
            }, function(cmd, errno, msg) {
                PlayerPreview.waiter.hide();
                CGI.autoErrorHandler(cmd, errno, msg);
                $('#pv-adv-commit').removeAttr('disabled');
            });
        });

        $('#pv-mirroring').on('click', function() {
            if (_batchOp) {
                return;
            }
            var id = parseInt($('#pv-adv-channel').val());
            $(this).attr('disabled', true);
            $('#pv-adv-commit').attr('disabled', true);

            g_device.channels[id].data.isp.mirroring = $('#pv-mirroring').is(':checked') ? 1 : 0;

            CGI.sendCommand('SetIsp', { "Isp": g_device.channels[id].data.isp }, function() {
                if (!$('#pv-mirroring').hasClass('image-isp-reset')) {
                    bc_alert();
                }
                $('#pv-mirroring').removeClass('image-isp-reset');
                $('#pv-mirroring').removeAttr('disabled');
                $('#pv-adv-commit').removeAttr('disabled');
            }, function(cmd, errno, msg) {
                CGI.autoErrorHandler(cmd, errno, msg);
                $('#pv-mirroring').removeAttr('disabled');
                $('#pv-adv-commit').removeAttr('disabled');
            });
        });

        $('#pv-rotation').on('click', function() {
            if (_batchOp) {
                return;
            }
            var id = parseInt($('#pv-adv-channel').val());
            $(this).attr('disabled', true);
            $('#pv-adv-commit').attr('disabled', true);

            g_device.channels[id].data.isp.rotation = $('#pv-rotation').is(':checked') ? 1 : 0;

            CGI.sendCommand('SetIsp', { "Isp": g_device.channels[id].data.isp }, function() {
                if (!$('#pv-rotation').hasClass('image-isp-reset')) {
                    bc_alert();
                }
                $('#pv-rotation').removeClass('image-isp-reset');
                $('#pv-rotation').removeAttr('disabled');
                $('#pv-adv-commit').removeAttr('disabled');
            }, function(cmd, errno, msg) {
                CGI.autoErrorHandler(cmd, errno, msg);
                $('#pv-rotation').removeAttr('disabled');
                $('#pv-adv-commit').removeAttr('disabled');
            });
        });

        $('#pv-exposure').on('change', function() {

            $('.pv-exposure').hide();
            switch ($(this).val()) {
                case 'Auto':
                    break;
                case 'LowNoise':
                    $('#pv-gain').show();
                    break;
                case 'Anti-Smearing':
                    $('#pv-shutter').show();
                    break;
                case 'Manual':
                    $('#pv-gain').show();
                    $('#pv-shutter').show();
                    break;
                default:
                    break;
            }
        });

        $('#pv-white-balance').on('change', function() {

            $('.pv-white-balance').hide();
            switch ($(this).val()) {
                case 'Auto':
                    break;
                case 'Manual':
                    $('.pv-white-balance').show();
                    break;
                default:
                    break;
            }
        });

        $('#pv-backlight').on('change', function() {

            $('.pv-backlight').hide();
            switch ($(this).val()) {
                case 'Auto':
                    break;
                case 'BackLightControl':
                    $('.pv-blc').show();
                    break;
                case 'DynamicRangeControl':
                    $('.pv-drc').show();
                    break;
                default:
                    break;
            }
        });
    };
})();

/**
 * ViewImage 类负责 预览界面的图像控制
 */
function ViewImage() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ViewImage);

(function() {
    var _batchOp = false;

    ViewImage.refreshView = function() {
        var chObj = ControllerFlash.getSelectedChannel();
        ControllerMain.disableAbility('image');
        if (!chObj) {
            return;
        }
        ControllerMain.enableAbility('image');
        var ch = g_device.channels[chObj.getId()];

        $(['bright', 'contrast', 'hue', 'saturation', 'sharpen']).each(function() {
            $('#image-' + this).prop('outerHTML', '<div id="image-' + this + '"></div>');
            (function(eId) {
                $('#image-' + eId).slider({
                    "range": "min",
                    "value": ch.data.image[eId],
                    "min": ch.limits.image[eId].min,
                    "max": ch.limits.image[eId].max,
                    "change": function(v) {
                        if (_batchOp) {
                            return;
                        }
                        var chObj = ControllerFlash.getSelectedChannel();
                        if (!chObj) {
                            return;
                        }
                        var ch = g_device.channels[chObj.getId()];
                        if (!ch.data.image) {
                            return;
                        }
                        ch.data.image[eId] = $('#image-' + eId).slider('value');

                        CGI.sendCommand('SetImage', {
                            "Image": ch.data.image
                        }, function() {}, function(cmd, errno, msg) {
                            CGI.autoErrorHandler(cmd, errno, msg);
                        });
                    }
                });
            })(this);
        });

        if (!ControllerLogin.chkPermission('image', 'write', ch.index)) {
            ControllerMain.disableAbility('image');
        }
    };

    ViewImage.initUI = function() {


        $('#pv-image-default').on('click', function() {

            var chObj = ControllerFlash.getSelectedChannel();
            if (!chObj) {
                return;
            }
            var ch = g_device.channels[chObj.getId()];
            var fieldData = ch.initials.isp;
            if (!ch.data.image) {
                return;
            }
            _batchOp = true;
            $(['bright', 'contrast', 'hue', 'saturation', 'sharpen']).each(function() {
                $('#image-' + this).slider({
                    "value": ch.initials.image[this]
                });
                ch.data.image[this] = ch.initials.image[this];
            });

            if ($('#pv-rotation').is(':checked') != fieldData.rotation) { $('#pv-rotation').addClass('image-isp-reset').click(); }

            if ($('#pv-mirroring').is(':checked') != fieldData.mirroring) { $('#pv-mirroring').addClass('image-isp-reset').click(); }

            $('#pv-image-default').attr('disabled', true);

            CGI.sendCommand('SetImage', {
                "Image": ch.data.image
            }, function() {
                bc_alert();
                _batchOp = false;
                $('#pv-image-default').removeAttr('disabled');
            }, function(cmd, errno, msg) {
                CGI.autoErrorHandler(cmd, errno, msg);
                _batchOp = false;
                $('#pv-image-default').removeAttr('disabled');
            });

        });
    };


})();

/**
 * ViewEncode 类负责 预览界面的编码控制
 */
function ViewEncode() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ViewEncode);

(function() {

    ViewEncode.getCurrentData = function() {
        var chObj = ControllerFlash.getSelectedChannel();
        if (!chObj) {
            return null;
        }

        if (this.isMainStream()) {
            return g_device.channels[chObj.getId()].data.encode.mainStream;
        } else {
            return g_device.channels[chObj.getId()].data.encode.subStream;
        }
    };

    ViewEncode.getAllData = function() {
        var chObj = ControllerFlash.getSelectedChannel();
        if (!chObj) {
            return null;
        }

        return g_device.channels[chObj.getId()].data.encode;
    };

    ViewEncode.getCurrentSetting = function() {

        var chObj = ControllerFlash.getSelectedChannel();
        if (!chObj) {
            return null;
        }
        var setting = this.pickRange(chObj);
        if (this.isMainStream()) {
            return setting.mainStream;
        } else {
            return setting.subStream;
        }
    };

    ViewEncode.pickRange = function(chObj) {
        var settings = g_device.channels[chObj.getId()].limits.encode;
        var data = g_device.channels[chObj.getId()].data.encode;
        var setting = null;
        for (var i = 0; i < settings.length; ++i) {
            if (data.mainStream.size == settings[i].mainStream.size) {
                setting = settings[i];
                break;
            }
        }
        return setting;
    };

    ViewEncode.isMainStream = function() {
        return ($('#record-stream-select').val() == 'main');
    };

    ViewEncode.disableAll = function() {
        $('#basic-encode-settings *').attr('disabled', true);
    };

    ViewEncode.enableAll = function() {

        $('#basic-encode-settings *').removeAttr('disabled');
    };

    ViewEncode.refreshView = function() {
        $('#encode-resolution-select').html('');
        $('#encode-frame-rate-select').html('');
        $('#encode-maxinum-bit-select').html('');

        var chObj = ControllerFlash.getSelectedChannel();
        ControllerMain.disableAbility('enc');

        if (!chObj) {
            return;
        }
        ControllerMain.enableAbility('enc');

        var setting = this.getCurrentSetting();
        var data = this.getCurrentData();
        var ranges = g_device.channels[chObj.getId()].limits.encode;
        var audio = g_device.channels[chObj.getId()].data.encode.audio;

        if (this.isMainStream()) {

            if (audio !== undefined && chObj.getId() < ControllerMain.deviceInfo.audioNum) {

                $('#record-audio-select-vessel').show();

                if ($('#record-audio-select').is(':checked') != audio) {

                    $('#record-audio-select').click();
                }

            } else {

                $('#record-audio-select-vessel').hide();
            }

            for (var i = 0; i < ranges.length; ++i) {

                $('#encode-resolution-select').append('<option value="' + ranges[i].mainStream.size + '">' + ranges[i].mainStream.size + '</option>');
            }
        } else {
            $('#record-audio-select-vessel').hide();
            $('#encode-resolution-select').append('<option value="' + setting.size + '">' + setting.size + '</option>');
        }

        $('#encode-resolution-select').val(data.size);


        for (var i = 0; i < setting.bitRate.length; ++i) {
            $('#encode-maxinum-bit-select').append('<option value="' + setting.bitRate[i] + '">' + setting.bitRate[i] + '</option>');
        }

        for (var i = 0; i < setting.frameRate.length; ++i) {
            $('#encode-frame-rate-select').append('<option value="' + setting.frameRate[i] + '">' + setting.frameRate[i] + '</option>');
        }

        if (setting.profile) {
            $('#encode-profile-select').html('');
            for (var i = 0; i < setting.profile.length; ++i) {
                $('#encode-profile-select').append('<option value="' + setting.profile[i] + '">' + setting.profile[i] + '</option>');
            }
            $('#encode-profile-select').val(data.profile);
            $('#encode-profile-select-vessel').show();
        } else {
            $('#encode-profile-select-vessel').hide();
        }
        $('#encode-maxinum-bit-select').val(data.bitRate);
        $('#encode-frame-rate-select').val(data.frameRate);

        if (!ControllerLogin.chkPermission('enc', 'write', chObj.getId())) {
            ControllerMain.disableAbility('enc');
        }
    };

    ViewEncode.initUI = function() {

        var isResolutionChange = false;
        var isProfileChange = false;
        $('#record-stream-select').on('change', function() {

            ViewEncode.refreshView();
        });

        $('#encode-resolution-select').on('change', function() {

            isResolutionChange = true;

            var chObj = ControllerFlash.getSelectedChannel();

            if (!chObj) {
                return;
            }

            ViewEncode.getCurrentData().size = $(this).val();

            var data = g_device.channels[chObj.getId()].data.encode;
            var range = ViewEncode.pickRange(chObj);

            if (ViewEncode.isMainStream()) { // 强制修改为默认码率和帧率
                data.subStream.bitRate = range.subStream.default.bitRate;
                data.subStream.frameRate = range.subStream.default.frameRate;

                data.mainStream.bitRate = range.mainStream.default.bitRate;
                data.mainStream.frameRate = range.mainStream.default.frameRate;
            }
            ViewEncode.refreshView();
        });

        $('#record-audio-select').on('click', function() {
            var data = ViewEncode.getAllData();
            if (data.audio !== undefined) {
                data.audio = $(this).is(':checked') ? 1 : 0;
            }
        });

        $('#encode-frame-rate-select').on('change', function() {

            ViewEncode.getCurrentData().frameRate = parseInt($(this).val());

        });

        $('#encode-maxinum-bit-select').on('change', function() {

            ViewEncode.getCurrentData().bitRate = parseInt($(this).val());

        });

        $('#preview_commit_encode').on('click', function() {

            $(this).attr('disabled', true);

            var chObj = ControllerFlash.getSelectedChannel();

            if (!chObj) {
                return;
            }

            PlayerPreview.waiter.show('Saving encode settings...');
            var data = g_device.channels[chObj.getId()].data.encode;
            CGI.sendCommand('SetEnc', {
                "Enc": data
            }, function() {
                PlayerPreview.waiter.hide();
                if (isProfileChange || isResolutionChange) {
                    bc_alert('Save encoding configuration successfully.<br>Now device will reboot, please wait and login later.', 'ok');
                    setTimeout(function() {
                        ControllerMain.onLogout();
                    }, 3000);
                } else {
                    bc_alert('Save encoding configuration successfully.', 'ok');
                }

                $('#preview_commit_encode').removeAttr('disabled');
            }, function(cmd, errno, msg) {
                PlayerPreview.waiter.hide();
                CGI.autoErrorHandler(cmd, errno, msg);
                $('#preview_commit_encode').removeAttr('disabled');
            });

        });

        $('#encode-profile-select').on('change', function() {
            isProfileChange = true;
            ViewEncode.getCurrentData().profile = $(this).val();

        });

        delete this.initUI;

    };


})();

/**
 * ViewPTZAction 类负责 预览界面的 PTZ 动作控制
 */
function ViewPTZAction() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ViewPTZAction);

(function() {

    ViewPTZAction.speed = 32;

    ViewPTZAction.autoTimer = null;

    ViewPTZAction.isPatrolRunning = false;

    ViewPTZAction.on('channelChange', function(chId) {
        this.channel = chId;
        $("#slider_ptz_speed").slider({
            "value": this.getPTZSpeed()
        });
        this.speed = this.getPTZSpeed();
    });

    ViewPTZAction.isAutoWillStop = function() {

        var viewObj = ViewManager.getSelectedView();

        if (viewObj !== null) {

            var channel = viewObj.getChannelId();

            if (ControllerLogin.abilities.abilityChn[channel]) {

                return ControllerLogin.abilities.abilityChn[channel].ptzType.ver === EnumPTZType.GM8136S_PTZ;
            }
        }

        return false;
    };

    // 获取ptzspeed
    ViewPTZAction.getPTZSpeed = function() {
        var viewObj = ViewManager.getSelectedView();
        if (viewObj !== null) {
            var channel = viewObj.getChannelId();
            var channelObj = ChannelManager.get(channel);
            if ((channel !== null) && (channel >= 0 && channel < ChannelManager.getNumber())) {
                return channelObj.getPTZSpeedValue();
            } else {
                return 32;
            }
        } else {
            return 32;
        }
    };

    ViewPTZAction.on('ptzAction', function(ac) {

        if (this.isPatrolRunning !== false) {
            $('[patrol-id=' + this.isPatrolRunning + ']').click();
            $('#ptz_cruise_stop_btn').click();
            return;
        }

        if (this.status != 'idle') {

            if (this.status != 'stopping' && this.action == 'Auto') {

                this.trigger('ptzRelease');
            }
            return;
        }

        this.action = ac;

        var params = {
            "channel": this.channel,
            "op": ac,
            "speed": this.speed
        };

        this.status = 'sending';

        CGI.sendCommand('PtzCtrl', params, function() {

            if (ViewPTZAction.status == 'stopping') {

                ViewPTZAction.status = 'working';
                ViewPTZAction.trigger('ptzRelease');

            } else {

                if (ViewPTZAction.action === "Auto") {

                    ViewPTZAction.autoTimer = setTimeout(function() {

                        ViewPTZAction.status = "idle";
                        ViewPTZAction.autoTimer = null;

                    }, 60000);
                }

                ViewPTZAction.status = 'working';
            }

            ViewPTZAction.action = ac;

            console.dbg('PTZ Start Action -', ac);

        }, function(cmd, errno, msg) {

            CGI.autoErrorHandler(cmd, errno, msg);

            if (ViewPTZAction.status == 'stopping') {
                ViewPTZAction.status = 'working';
                ViewPTZAction.trigger('ptzRelease');
            } else {
                ViewPTZAction.status = 'working';
            }

        });
    });

    ViewPTZAction.on('ptzRelease', function() {

        if (this.status == 'idle') {
            return;
        }

        if (this.isPatrolRunning !== false) {
            $('[patrol-id=' + this.isPatrolRunning + ']').click();
            $('#ptz_cruise_controllers').click();
            return;
        }
        if (this.status == 'stopping') {
            return;
        }
        if (this.status == 'sending') {
            this.status = 'stopping';
            return;
        }

        if (this.status == 'working') {

            ViewPTZAction.status == 'sendingStop';

            setTimeout(function() {
                CGI.sendCommand('PtzCtrl', {
                    "channel": ViewPTZAction.channel,
                    "op": "Stop"
                }, function() {

                    if (ViewPTZAction.autoTimer) {

                        clearTimeout(ViewPTZAction.autoTimer);
                        ViewPTZAction.autoTimer = null;
                    }

                    ViewPTZAction.status = 'idle';
                    ViewPTZAction.action = 'none';

                    console.dbg('PTZ Stopped.');

                }, CGI.autoErrorHandler);
            }, 200);
        }
    });

    ViewPTZAction.initUI = function() {

        this.status = 'idle';
        this.action = 'none';

        this.acting = false;
        this.actingAuto = false;

        // ptz speed
        $("#slider_ptz_speed").slider({
            range: "min",
            value: ViewPTZAction.getPTZSpeed(), // g_plugin.preview.getPreviewPTZSpeed(),
            min: 1,
            max: 64,
            slide: function(event, ui) {
                ViewPTZAction.speed = ui.value;
                if (ChannelManager.get(ViewPTZAction.channel)) {
                    ChannelManager.get(ViewPTZAction.channel).setPTZSpeedValue(ui.value);
                }
                $("#amount_ptz_speed").val(ui.value);
            }
        });

        $("#amount_ptz_speed").val(ViewPTZAction.speed = $("#slider_ptz_speed").slider("value"));

        // preview ptz direction button

        function releasePTZDirection(e) {

            if ($(this).attr('ptz-ac') == 'Auto' || ViewPTZAction.action == 'Auto') {
                return;
            }

            if ($(this).attr('ptz-ac') != ViewPTZAction.action) {
                return;
            }

            ViewPTZAction.trigger('ptzRelease');
        };

        $(".ptz-action-cmd").each(function() {
            $(this)
                .on('blur', releasePTZDirection)
                .on('mouseup', function(e) {

                    if (e.button != 0 || $(this).attr('ptz-ac') == 'Auto' || ViewPTZAction.action == 'Auto') {
                        return;
                    }

                    ViewPTZAction.trigger('ptzRelease');
                })
                .on('mouseleave', releasePTZDirection)
                .mousedown(function(e) {
                    if (e.button != 0) { return; }
                    ViewPTZAction.trigger('ptzAction', [$(this).attr('ptz-ac')]);
                });
        });

        $("#ptz_dir_center").mousedown(function(e) {
            if (e.button != 0) { return; }
            ViewPTZAction.trigger('ptzAction', ["Auto"]);
        });

        delete this.initUI;
    };

})();

/**
 * ViewPTZPreset 类负责 预览界面的 PTZ 预置点和巡航控制
 */
function ViewPTZPreset() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ViewPTZPreset);

(function() {

    var $presetVessel;
    var $cruiseVessel;

    var $presetDelButton;
    var $presetCallButton;
    var $presetSetButton;
    var $presetRenameButton;

    var $patrolRunButton;
    var $patrolStopButton;
    var $patrolModifyButton;

    var _preset_menu_sel = EnumPrePresetMenuType.PRESET;

    this.refreshPresetMenuSel = function() {

        if (EnumPrePresetMenuType.PRESET == _preset_menu_sel) {

            $("#pre_preset_menu_preset_view").addClass("pre_preset_menu_item_sel");
            $("#pre_preset_menu_cruise_view").removeClass("pre_preset_menu_item_sel");
            $("#pre_preset_preset_container").show();
            $("#pre_preset_cruise_container").hide();

        } else if (EnumPrePresetMenuType.CRUISE == _preset_menu_sel) {

            $("#pre_preset_menu_preset_view").removeClass("pre_preset_menu_item_sel");
            $("#pre_preset_menu_cruise_view").addClass("pre_preset_menu_item_sel");
            $("#pre_preset_preset_container").hide();
            $("#pre_preset_cruise_container").show();
        }
    };

    this.initUI = function() {

        $("#pre_preset_menu_preset_view").click(function(event) {

            if (_preset_menu_sel == EnumPrePresetMenuType.PRESET) {

                return;
            }
            _preset_menu_sel = EnumPrePresetMenuType.PRESET;
            ViewPTZPreset.refreshPresetMenuSel();

        });

        $("#pre_preset_menu_cruise_view").click(function(event) {
            if (_preset_menu_sel == EnumPrePresetMenuType.CRUISE) {
                return;
            }

            _preset_menu_sel = EnumPrePresetMenuType.CRUISE;
            ViewPTZPreset.refreshPresetMenuSel();
        });

        $presetCallButton = $('#ptz_preset_call_btn');
        $presetDelButton = $('#ptz_preset_del_btn');
        $presetSetButton = $('#ptz_preset_set_btn');

        $patrolRunButton = $('#ptz_cruise_run_btn');
        $patrolStopButton = $('#ptz_cruise_stop_btn');
        $patrolModifyButton = $('#ptz_cruise_modify_btn');

        $presetVessel = $('#pre_preset_preset_listContainer');
        $cruiseVessel = $('#pre_preset_cruise_listContainer');

        $presetVessel.on('click', 'div', function(e) {

            if (e.target.nodeName != 'SPAN' && e.target.nodeName != 'DIV') {
                return;
            }

            var preset = ViewPTZPreset.getSelectedPreset();

            if ($(e.target).hasClass('pre_preset_list_name')) {
                if ($(this).hasClass('selected')) {
                    if ($(this).find('input').length == 0) {
                        $(this).find('.pre_preset_list_name').html('<input maxlength="' + ViewPTZPreset.maxNameLength + '" type="text" id="preset-name-modifier">');
                        $('#preset-name-modifier').val(preset.name).focus();
                        return;
                    }
                }
            }

            if (!$(this).hasClass('selected') && $presetVessel.find('input').length > 0) {
                var newName = $presetVessel.find('input').val();
                if (newName == preset.name) {
                    $presetVessel.find('.selected .pre_preset_list_name').text(newName);
                } else {
                    ViewPTZPreset.renamePresetPoint(preset, newName);
                }
                return;
            }

            $presetVessel.find('.selected').removeClass('selected');
            $(this).addClass('selected');

            if ($(this).find('.pre_preset_list_status').text() == 'Set') {
                $('#ptz_preset_controllers button').removeAttr('disabled');
            } else {
                $('#ptz_preset_controllers button').attr('disabled', true);
                $presetSetButton.removeAttr('disabled').text('Set');
            }
        });

        $presetVessel.on('dblclick', 'div', function(e) {

            if (e.target.nodeName != 'SPAN' && e.target.nodeName != 'DIV') {
                return;
            }

            if ($(e.target).hasClass('pre_preset_list_name')) {
                return;
            }

            if ($(this).find('.pre_preset_list_status').text() == 'Set') {
                $presetCallButton.click();
            } else {
                $presetSetButton.click();
            }

            return false;
        });

        $cruiseVessel.on('click', 'a', function() {
            $cruiseVessel.find('.selected').removeClass('selected');
            $(this).addClass('selected');
            if ($(this).find('.pre_preset_list_status').text() == 'Running') {
                $('#ptz_cruise_controllers button').removeAttr('disabled');
                $patrolRunButton.attr('disabled', true);
            } else {
                $('#ptz_cruise_controllers button').attr('disabled', true);
                $patrolRunButton.removeAttr('disabled');
            }
            $patrolModifyButton.removeAttr('disabled');
        });

        $presetDelButton.on('click', function() {
            var point = ViewPTZPreset.getSelectedPreset();
            if (!point) {
                return;
            }
            ViewPTZPreset.removePresetPoint(point);
        });

        $presetSetButton.on('click', function() {
            var point = ViewPTZPreset.getSelectedPreset();
            if (!point) {
                return;
            }

            ViewPTZPreset.setPresetPoint(point);

        });

        $presetCallButton.on('click', function() {
            var point = ViewPTZPreset.getSelectedPreset();
            if (!point) {
                return;
            }
            if (point.enable) {
                ViewPTZPreset.callPresetPoint(point);
            } else {
                $(this).attr('disable', true);
            }
        });

        $patrolRunButton.on('click', function() {
            var patrol = ViewPTZPreset.getSelectedPatrol();
            if (!patrol) {
                return;
            }
            if (!patrol.running) {
                ViewPTZPreset.runPatrol(patrol);
            } else {
                $(this).attr('disable', true);
            }
        });

        $patrolStopButton.on('click', function() {
            var patrol = ViewPTZPreset.getSelectedPatrol();
            if (!patrol) {
                return;
            }
            if (patrol.running) {
                ViewPTZPreset.stopPatrol(patrol);
            } else {
                $(this).attr('disable', true);
            }
        });

        $patrolModifyButton.on('click', function() {
            var patrol = ViewPTZPreset.getSelectedPatrol();
            if (!patrol) {
                return;
            }
            ControllerPatrolModifier.show(patrol);
        });

        delete this.initUI;
    };

    this.callPresetPoint = function(point) {
        PlayerPreview.waiter.show('Calling PTZ-Preset point...');
        CGI.sendCommand('PtzCtrl', {
            "channel": point.channel,
            "op": "ToPos",
            "speed": ViewPTZAction.speed,
            "id": point.id
        }, function() {
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            PlayerPreview.waiter.hide();
            CGI.autoErrorHandler(cmd, errno, msg);
        });
    };

    this.runPatrol = function(patrol) {
        if (patrol.running != 0) {
            return;
        }
        PlayerPreview.waiter.show('Starting a PTZ-Patrol...');
        CGI.sendCommand('PtzCtrl', {
            "channel": patrol.channel,
            "op": "StartPatrol",
            "id": patrol.id
        }, function() {
            $patrolRunButton.attr('disabled', true);
            $patrolStopButton.removeAttr('disabled');
            patrol.running = 1;
            ViewPTZAction.isPatrolRunning = patrol.id;
            $('[patrol-id=' + patrol.id + ']').find('.pre_preset_list_status').text('Running');
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            PlayerPreview.waiter.hide();
            CGI.autoErrorHandler(cmd, errno, msg);
        });
    };

    this.stopPatrol = function(patrol) {
        if (patrol.running == 0) {
            return;
        }
        PlayerPreview.waiter.show('Stopping a PTZ-Patrol...');
        CGI.sendCommand('PtzCtrl', {
            "channel": patrol.channel,
            "op": "StopPatrol",
            "id": patrol.id
        }, function() {
            patrol.running = 0;
            ViewPTZAction.isPatrolRunning = false;
            $patrolRunButton.removeAttr('disabled');
            $patrolStopButton.attr('disabled', true);
            $('[patrol-id=' + patrol.id + ']').find('.pre_preset_list_status').text('Idle');
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            PlayerPreview.waiter.hide();
            CGI.autoErrorHandler(cmd, errno, msg);
        });
    };

    this.renamePresetPoint = function(point, newName) {
        var enableTarget = point.enable,
            enableOld = point.enable;
        var oldName = point.name;
        if (newName.trim() == '') {
            ViewPTZPreset.refreshView();
            $('[preset-id=' + point.id + ']').click();
            return;
        }
        point.name = newName;
        if (point.enable) {
            delete point.enable;
        } else {
            point.enable = enableTarget = 1;
        }
        PlayerPreview.waiter.show('Renaming a PTZ-Preset point...');
        CGI.sendCommand('SetPtzPreset', { "PtzPreset": point }, function() {
            point.enable = enableTarget;
            ViewPTZPreset.refreshView();
            $('[preset-id=' + point.id + ']').click();
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            point.name = oldName;
            point.enable = enableOld;
            CGI.autoErrorHandler(cmd, errno, msg);
            PlayerPreview.waiter.hide();
        });
    };

    this.removePresetPoint = function(point) {
        PlayerPreview.waiter.show('Removing PTZ-Preset point...');
        point.enable = 0;
        CGI.sendCommand('SetPtzPreset', { "PtzPreset": point }, function() {
            point.name = 'pos' + point.id;
            ViewPTZPreset.refreshView();
            $('[preset-id=' + point.id + ']').click();
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            CGI.autoErrorHandler(cmd, errno, msg);
            PlayerPreview.waiter.hide();
        });
    };

    this.savePatrol = function(patrol) {
        PlayerPreview.waiter.show('Saving PTZ-Patrol settings...');
        patrol.enable = 1;
        delete patrol.name;
        CGI.sendCommand('SetPtzPatrol', { "PtzPatrol": patrol }, function() {
            ViewPTZPreset.refreshView();
            $('[patrol-id=' + patrol.id + ']').click();
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            CGI.autoErrorHandler(cmd, errno, msg);
            PlayerPreview.waiter.hide();
        });
    };

    this.setPresetPoint = function(point) {
        if ($presetVessel.find('input').length > 0) {
            if ($presetVessel.find('input').val() == "") {
                return;
            }
            point.name = $presetVessel.find('input').val();
        }
        PlayerPreview.waiter.show('Setting PTZ-Preset point...');
        point.enable = 1;
        CGI.sendCommand('SetPtzPreset', { "PtzPreset": point }, function() {
            ViewPTZPreset.refreshView();
            $('[preset-id=' + point.id + ']').click();
            PlayerPreview.waiter.hide();
        }, function(cmd, errno, msg) {
            CGI.autoErrorHandler(cmd, errno, msg);
            PlayerPreview.waiter.hide();
        });
    };

    this.getSelectedPreset = function() {
        var ch = ControllerFlash.getSelectedChannelInfo();
        var $selected = $presetVessel.find('.selected');

        if (!ch || $selected.length == 0) {
            return null;
        }

        return ch.data.ptzPreset[parseInt($selected.attr('preset-id')) - 1];
    };

    this.getSelectedPatrol = function() {
        var ch = ControllerFlash.getSelectedChannelInfo();
        var $selected = $cruiseVessel.find('.selected');

        if (!ch || $selected.length == 0) {
            return null;
        }

        return ch.data.ptzPatrol[parseInt($selected.attr('patrol-index'))];
    };

    this.maxNameLength = 16;

    this.refreshView = function() {

        var ch = ControllerFlash.getSelectedChannelInfo();

        $('.pre_preset_preset_list_base_item').remove();

        if (!ch) {
            return;
        }

        $('.ptz-preset-modifier').hide();
        $('.ptz-preset-normal').show();

        var presetData = ch.data.ptzPreset;
        var patrolData = ch.data.ptzPatrol;
        if (ControllerLogin.chkVersion("ptzPreset", EnumPatrolType.NORMAL, ch.index) && ControllerLogin.chkPermission('ptzPreset', 'exec', 0)) {

            this.maxNameLength = ch.limits.ptzPreset.name.maxLen;

            for (var j = 0; j < presetData.length; ++j) {
                var presetPoint = presetData[j];
                $presetVessel.append('<div class="' +
                    'pre_preset_preset_list_base_item pre_preset_preset_list_item' +
                    '" preset-id="' +
                    presetPoint.id +
                    '">' +
                    '<span class="pre_preset_preset_list_item_item pre_preset_list_id">' +
                    presetPoint.id +
                    '</span>' +
                    '<span class="pre_preset_preset_list_item_item pre_preset_list_name" title="' + presetPoint.name + '">' + presetPoint.name + '</span>' +
                    '<span class="pre_preset_preset_list_item_item pre_preset_list_status">' + (presetPoint.enable ? 'Set' : 'Unused') + '</span>' +
                    '</div>');
                if (presetPoint.name.trim().length == 0) {
                    $('[preset-id=' + presetPoint.id + ']').addClass('noname').find('.pre_preset_list_name').text('--noname--');
                }
            }
        }

        if (ControllerLogin.chkVersion("ptzPatrol", EnumPatrolType.NORMAL, ch.index) && ControllerLogin.chkPermission('ptzPatrol', 'exec', 0)) {
            for (var j = 0; j < patrolData.length; ++j) {
                var patrolLine = patrolData[j];
                $cruiseVessel.append('<a patrol-index="' + j + '" class="' +
                    'pre_preset_preset_list_base_item pre_preset_preset_list_item' +
                    '" href="javascript:void(0)" patrol-id="' +
                    patrolLine.id +
                    '">' +
                    '<span class="pre_preset_preset_list_item_item pre_preset_list_id">' +
                    patrolLine.id +
                    '</span>' +
                    '<span class="pre_preset_preset_list_item_item pre_preset_list_name">Cruise Path 0</span>' +
                    '<span class="pre_preset_preset_list_item_item pre_preset_list_status">' + (patrolLine.running ? 'Running' : 'Idle') + '</span>' +
                    '</a>');
            }

        }
    };

}).apply(ViewPTZPreset);