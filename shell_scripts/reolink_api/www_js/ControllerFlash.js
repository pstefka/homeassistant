/*
 * ControllerFlash 类负责 Flash 模式的控制流程。
 * 
 * 作者：曾鹏辉
 * 日期：2016-01-25 12:15
 */

function ControllerFlash() {
    throw { "msg": "Don't NEW a singleton." };
}

EventListener.apply(ControllerFlash);

(function() {

    var _logined = false;

    ControllerFlash.init = function() {

        $('#preview_plugin_container').addClass('flashMode');

        ControllerMain.on('switchPreviewMode', function() {
            if (ViewManager.getMode() !== EnumCurState.PLAYBACK && ViewManager.getMode() != EnumCurState.CONFIG)
                return;
            FPlayer.setMode(EnumCurState.PREVIEW);
        });

        ControllerMain.on('switchPlaybackMode', function() {
            if (ViewManager.getMode() != EnumCurState.PREVIEW && ViewManager.getMode() != EnumCurState.CONFIG)
                return;
            FPlayer.setMode(EnumCurState.PLAYBACK);
        });

        /**
         * 视图的双击响应事件
         */
        ViewManager.on('dblclick', function() {
            if (g_device.channels.length == 1) { // 遮蔽单通道下双击放大
                return false;
            }
            if (this.getScreenViews() == EnumScreenMode.ONE) {
                if (!this.recoverScreen()) {
                    return;
                }
                this.showScreen(this.getScreenViews(), true);
            } else {
                this.storeScreen();
                this.showScreen(EnumScreenMode.ONE);
            }
            this.updateView();
        });

        ViewManager.on('updateView', function() {

            var i, fplayer, channel, viewBegin, viewEnd;
            viewBegin = ViewManager.getCurrentPage() * ViewManager.getScreenViews();
            viewEnd = (ViewManager.getCurrentPage() + 1) * ViewManager.getScreenViews();

            if (viewEnd >= ViewManager.getMaxViewNumber())
                viewEnd = ViewManager.getMaxViewNumber();

            for (i = 0; i < viewBegin; i++) {
                channel = ViewManager.getViewObject(i).getChannelId();
                if (channel === null || !(fplayer = FPlayer.get(channel)))
                    continue;
                try {
                    fplayer.pause();
                } catch (e) {}
                fplayer.hide();
            }

            for (i = viewBegin; i < viewEnd; i++) {
                channel = ViewManager.getViewObject(i).getChannelId();
                if (channel === null || !(fplayer = FPlayer.get(channel)))
                    continue;
                fplayer.show();
                try {
                    fplayer.play();
                } catch (e) {}
                fplayer.setPosition();
            }

            for (i = viewEnd; i < ViewManager.getMaxViewNumber(); i++) {
                channel = ViewManager.getViewObject(i).getChannelId();
                if (channel === null || !(fplayer = FPlayer.get(channel)))
                    continue;
                try {
                    fplayer.pause();
                } catch (e) {}
                fplayer.hide();
            }
        });

        ViewManager.on('click', function(viewObj, $viewObj) {
            if (viewObj.getChannelId() == null || viewObj.getMode() != 'PREVIEW') {
                $('#basic-osd-settings *').attr('disabled', true);
                ViewEncode.disableAll();
                return;
            }

            $('#basic-osd-settings *').removeAttr('disabled');
            ViewEncode.enableAll();
            var chObj = ChannelManager.get(viewObj.getChannelId());
            var chId = chObj.getId();
            ControllerMain.disableAbility('osd');
            ControllerMain.disableAbility('enc');

            PlayerPreview.isRefreshingRightBar = 1;
            CGI.clearCommands();

            CGI.prepareCommand('GetOsd', { "channel": chId }, true);
            CGI.prepareCommand('GetEnc', { "channel": chId }, true);
            CGI.prepareCommand('GetImage', { "channel": chId }, true);
            CGI.prepareCommand('GetIsp', { "channel": chId }, true);

            if (ControllerLogin.chkVersion('ptzPatrol', EnumPatrolType.NORMAL, chId) && ControllerLogin.chkPermission('ptzPatrol', 'exec', 0)) {
                CGI.prepareCommand('GetPtzPatrol', { "channel": chId }, true);
            }

            if (ControllerLogin.chkPermission('ptzPreset', 'exec', chId)) {
                CGI.prepareCommand('GetPtzPreset', { "channel": chId }, true);
            }

            CGI.commitCommands(function(cmd, data, range, initial) {
                var ch = ControllerFlash.getSelectedChannelInfo();
                switch (cmd) {
                    case 'GetOsd':
                        ch.data.osd = data.Osd;
                        ch.limits.osd = range.Osd;
                        ch.initials.osd = initial.Osd;
                        break;
                    case 'GetEnc':
                        ch.data.encode = data.Enc;
                        ch.limits.encode = range.Enc;
                        ch.initials.encode = initial.Enc;
                        ViewEncode.reboot = false;
                        break;
                    case 'GetImage':
                        ch.data.image = data.Image;
                        ch.limits.image = range.Image;
                        ch.initials.image = initial.Image;
                        break;
                    case 'GetIsp':
                        ch.data.isp = data.Isp;
                        ch.limits.isp = range.Isp;
                        ch.initials.isp = initial.Isp;
                        break;
                    case 'GetPtzPatrol':
                        ch.data.ptzPatrol = data.PtzPatrol;
                        ch.limits.ptzPatrol = range.PtzPatrol;
                        break;
                    case 'GetPtzPreset':
                        ch.data.ptzPreset = data.PtzPreset;
                        ch.limits.ptzPreset = range.PtzPreset;
                        break;
                    default:
                        bc_alert('An unexpected result returned.');
                        break;
                }
                PlayerPreview.waiter.hide();
            }, function(a, b, c) {
                setTimeout(function() {
                    PlayerPreview.isRefreshingRightBar = 0;
                }, 500);
                PlayerPreview.waiter.hide();
                CGI.autoErrorHandler(a, b, c);
                PlayerPreview.redrawRightView(chObj.getId());
            }, function() {

                setTimeout(function() {
                    PlayerPreview.isRefreshingRightBar = 0;
                }, 500);

                PlayerPreview.redrawRightView(chObj.getId());
                PlayerPreview.waiter.hide();
                ViewEncode.refreshView();
                ViewOSD.refreshView();
                ViewImage.refreshView();
                ViewISP.refreshView();

                ViewPTZPreset.refreshView();

            });

            ViewPTZAction.trigger('channelChange', [chObj.getId()]);
        });

        ViewManager.on('close', function(viewObj, $obj) {
            var channel = ChannelManager.get(viewObj.getChannelId());
            FPlayer.close(channel.getId());
            viewObj.unbindChannel();
            channel.unbindView(viewObj.getId());
        });

        FPlayer.on('statechange', function(fplayer, newChannelStatus, newViewStatus) {
            var channelObj = ChannelManager.get(fplayer.getChannel());
            var viewObj = ViewManager.getViewObject(channelObj.getViewId());
            console.dbg('Channel[' + channelObj.getId() + ']:', 'Switched to stream -', EnumStreamFullNames[fplayer.getStream()]);
            channelObj.updateStream(fplayer.getStream());
            channelObj.setStatus(newChannelStatus);

            if (viewObj) {
                viewObj.updateStatus(newViewStatus, fplayer.getStream());
            }
        });

        ChannelManager.on('open', function(chObj, $chObj, newStream) {
            if (chObj.getViewId() === null) {
                return;
            }

            if (FPlayer.get(chObj.getId()) === undefined) {
                if (chObj.getMode() == 'PLAYBACK') {
                    if (!chObj.url) {
                        return;
                    }
                    FPlayer.open(chObj.getId(), {
                        "url": chObj.url,
                        "seekTo": chObj.seekTo,
                        "stream": newStream
                    });

                } else {

                    FPlayer.open(chObj.getId(), {
                        "url": PlayerPreview.constructRTMPUrl(chObj.getId(), newStream),
                        "stream": newStream
                    });
                }
            } else {
                if (chObj.getMode() == 'PLAYBACK') {
                    FPlayer.close(chObj.getId());
                    FPlayer.open(chObj.getId(), {
                        "url": chObj.url,
                        "seekTo": chObj.seekTo,
                        "stream": newStream
                    });
                } else {
                    if (chObj.getStatus() == EnumChannelStatus.PLAYING) {
                        if (newStream == chObj.getStream()) {
                            return;
                        }
                    }
                    FPlayer.get(chObj.getId()).playStream(newStream, PlayerPreview.constructRTMPUrl(chObj.getId(), newStream));
                }
            }
        });

        ChannelManager.on('close', function(chObj, $chObj) {
            if (FPlayer.get(chObj.getId()) !== undefined) {
                FPlayer.close(chObj.getId());
            }
        });

        ControllerFlash.setView = function(viewObj, channelId) {
            var preViewId, preChannelId = viewObj.getChannelId();
            var preViewObj, preChannelObj;
            var channelObj = ChannelManager.get(channelId);
            console.dbg('ViewManager: Trying bind Channel[' + channelObj.getId() + '] with View[' + viewObj.getId() + ']');
            if (viewObj.isEmpty()) {
                if (channelObj.getViewId() === viewObj.getId()) {
                    viewObj.setSelected();
                    return;
                }
                if (channelObj.getViewId() === null) {
                    viewObj.bindChannel(channelId);
                    channelObj.bindView(viewObj.getId());
                    channelObj.open(channelObj.getMode() == 'PLAYBACK' ? PlayerPlayback.streamSel : PlayerPreview.previewStreamSel);
                } else {
                    ViewManager.getViewObject(channelObj.getViewId()).unbindChannel();
                    viewObj.bindChannel(channelId);
                    channelObj.bindView(viewObj.getId());
                    ViewManager.updateView();
                }
            } else { // !viewObject.isEmpty()
                if (channelObj.getViewId() === null) {

                    ChannelManager.get(preChannelId).unbindView();
                    viewObj.bindChannel(channelId);
                    channelObj.bindView(viewObj.getId());
                    ChannelManager.close([preChannelId])
                    channelObj.open(channelObj.getMode() == 'PLAYBACK' ? PlayerPlayback.streamSel : PlayerPreview.previewStreamSel);

                } else {
                    preChannelObj = ChannelManager.get(preChannelId);
                    preViewObj = ViewManager.getViewObject(channelObj.getViewId());
                    preChannelObj.bindView(channelObj.getViewId());
                    channelObj.bindView(viewObj.getId());
                    preViewObj.bindChannel(preChannelId);
                    viewObj.bindChannel(channelId);
                    ViewManager.updateView();
                }
            }
            viewObj.setSelected();

        };

        ControllerMain.on('logout', function() {
            if (!ControllerMain.isLogouted) {
                CGI.sendCommand('Logout', {}, function() {
                    ControllerMain.onLogout();
                }, function() {
                    ControllerMain.onLogout();
                });
                ControllerMain.isLogouted = true;
            }
            setTimeout(ControllerMain.onLogout, 3000);
        });

        ViewManager.on('download', function(viewObj, $obj) {
            ControllerDownload.show(viewObj.getChannelId());
        });

        ViewManager.on('snap', function(viewObj, $obj) {
            ControllerSnap.show(viewObj.getChannelId());
        });

        ViewManager.on('fillmode', function(viewObj, $obj) {

            var fp;

            if (viewObj.getChannelId() != null) {
                if (fp = FPlayer.get(viewObj.getChannelId())) {
                    if (fp.isExactFit()) {
                        fp.setExactFit(false);
                        $obj.find('.view-fill').removeClass('exfit');
                    } else {
                        fp.setExactFit(true);
                        $obj.find('.view-fill').addClass('exfit');
                    }

                }
            }
        });

        ViewManager.on('drop', function(viewObj, $obj, $channel) {
            ControllerFlash.setView(viewObj, parseInt($channel.attr("bc-channel-id")));
        });

        // 绑定全部播放按钮
        PlayerPreview.on('playAllStream', function(streamType) {

            switch (streamType) {
                case EnumStreamType.BALANCED:
                case EnumStreamType.FLUENT:
                case EnumStreamType.CLEAR:

                    PlayerPreview.previewChangePlayStreamSel(streamType);

                    var chn = ControllerLogin.abilities.abilityChn;

                    for (var i = 0; i < ChannelManager.getNumber(); i++) {

                        var chObj = ChannelManager.get(i);

                        if (chn[i].live && chn[i].live.ver == 2 && streamType == EnumStreamType.BALANCED) {

                            streamType = EnumStreamType.FLUENT;
                        }

                        if (chObj.getViewId() !== null) {

                            chObj.open(streamType);
                        }
                    }
                    break;
                case EnumStreamType.AUTO:
                default:

                    if (ControllerLogin.chkPermission('wifi', 'read')) {
                        streamType = EnumStreamType.FLUENT;
                    } else {
                        streamType = EnumStreamType.CLEAR;
                    }

                    var chn = ControllerLogin.abilities.abilityChn;

                    for (var i = 0; i < ChannelManager.getNumber(); i++) {

                        var chObj = ChannelManager.get(i);

                        if (chObj.getViewId() !== null) {

                            chObj.open(streamType);
                        }
                    }
                    break;
            }
            $('[data-toggle="popover"]').popover('hide');
        });

        // 绑定全部播放按钮
        PlayerPreview.on('stopAllStream', function() {
            for (var i = 0; i < ChannelManager.getNumber(); i++) {
                var chObj = ChannelManager.get(i);
                if (chObj.getViewId() !== null) {
                    FPlayer.stop(i);
                }
            }
        });

        // 回放：绑定全部播放按钮
        PlayerPlayback.on('playAllStream', function(streamType) {
            PlayerPlayback.pbChangePlayStreamSel(streamType);
            $('[data-toggle="popover"]').popover('hide');
        });

        // 回放：全部暂停按钮
        PlayerPlayback.on('stopAllStream', function() {
            for (var i = 0; i < ChannelManager.getNumber(); i++) {
                var chObj = ChannelManager.get(i);
                if (chObj.getViewId() !== null) {
                    FPlayer.close(i);
                }
            }
        });

        // 回放：全部暂停按钮
        PlayerPlayback.on('pauseAllStream', function() {
            for (var i = 0; i < ChannelManager.getNumber(); i++) {
                var chObj = ChannelManager.get(i);
                if (chObj.getViewId() !== null) {
                    FPlayer.pause(i);
                }
            }
        });

        ControllerMain.on('gotoRemoteConfig', function() {
            ControllerRemoteConfig.loadMainView();
        });

        // 回放：连续播放
        FPlayer.on('complete', function(fplayer) {
            var chObj = ChannelManager.get(fplayer.getChannel());
            var file;
            if (fplayer.getMode() != 'PLAYBACK' || chObj.playingDay != ViewReplaySearch.getUsingDay().getUnixDateOnly() || chObj.playingStream != ViewReplaySearch.getSelectedStream()) {
                FPlayer.close(chObj.getId());
                PlayerPlayback.updateState(EnumPBPlayState.IDLE);
                return;
            }
            var ch = g_device.channels[chObj.getId()];
            if (ch.playbackFiles.length > ++chObj.playingFile) {
                file = ch.playbackFiles[chObj.playingFile];
                chObj.playingStart = (file.startTime.getTime() - ViewReplaySearch.getUsingDay().getTime()) / 1000;
                FPlayer.close(chObj.getId());
                FPlayer.open(chObj.getId(), {
                    "url": PlayerPlayback.constructRTMPUrl(chObj.getId(), file.fileName, ViewReplaySearch.getSelectedStream()),
                    "seekTo": 0,
                    "stream": ViewReplaySearch.getSelectedStream()
                });
                PlayerPlayback.updateState(EnumPBPlayState.PLAYING);
            } else {
                FPlayer.close(chObj.getId());
                PlayerPlayback.updateState(EnumPBPlayState.IDLE);
            }
        });

        // 时间轴走动
        FPlayer.on('walking', function(fp, args) {
            if (args.position == undefined) {
                return;
            }
            var chObj = ChannelManager.get(fp.getChannel());

            ViewReplaySearch.updateCursor(args.position + chObj.playingStart);

            g_pbFileBarCanvas.refreshCanvasByCurSecond(parseInt(args.position) + chObj.playingStart);
        });

        this.initUI && this.initUI();

        delete this.init;
    };

    ControllerFlash.getChannelInfo = function(id) {
        return g_device.channels[id];
    };

    ControllerFlash.getSelectedChannelInfo = function() {
        var viewObj = ViewManager.getSelectedView();
        if (!viewObj || viewObj.getChannelId() == null) {
            return;
        }
        return this.getChannelInfo(viewObj.getChannelId());
    };

    ControllerFlash.getSelectedChannel = function() {
        var viewObj = ViewManager.getSelectedView();
        if (!viewObj || viewObj.getChannelId() == null) {
            return;
        }
        return ChannelManager.get(viewObj.getChannelId());
    };

    ControllerFlash.initUI = function() {

        // hide volume adjust controller if no audio supported.
        if (0 < ControllerMain.deviceInfo.audioNum) {
            $('.Player_Bar_fright').show();
            $('.Player_Bar_fleft ul li:nth-child(2)').show();
        } else {
            $('.Player_Bar_fright').hide();
            $('.Player_Bar_fleft ul li:nth-child(2)').hide();
        }

        function setPlayerVolume(v) {
            for (var i = 0; i < ChannelManager.getNumber(); i++) {
                var chObj = ChannelManager.get(i);
                if (chObj.getViewId() !== null) {
                    try {
                        FPlayer.get(i).setVolume(v);
                    } catch (e) {

                    }
                }
            }
        }

        function onPvSoundSliding(event, ui) {
            if (ui.value == 0) {
                $('#pv-slient-ctrl').addClass('slient');
            } else {
                $('#pv-slient-ctrl').removeClass('slient');
            }
            window.localStorage.setItem("/player/preview/volume", ui.value);
            setPlayerVolume(ui.value);
        }
        var defVolume = window.localStorage.getItem("/player/preview/volume");
        if (typeof(defVolume) !== "string") {
            defVolume = 50;
        } else {
            defVolume = parseInt(defVolume);
        }
        $('#preview_sound_slid').slider2({
            "range": "min",
            "value": defVolume,
            "min": 0,
            "max": 100,
            "slide": onPvSoundSliding
        });

        if (defVolume === 0) {
            $('#pv-slient-ctrl').addClass('slient');
        }

        function onPbSoundSliding(event, ui) {
            if (ui.value == 0) {
                $('#pb-slient-ctrl').addClass('slient');
            } else {
                $('#pb-slient-ctrl').removeClass('slient');
            }
            window.localStorage.setItem("/player/playback/volume", ui.value);
            setPlayerVolume(ui.value);
        }
        defVolume = window.localStorage.getItem("/player/playback/volume");
        if (typeof(defVolume) !== "string") {
            defVolume = 50;
        } else {
            defVolume = parseInt(defVolume);
        }
        $('#pb_sound_slider').slider2({
            "range": "min",
            "value": defVolume,
            "min": 0,
            "max": 100,
            "slide": onPbSoundSliding
        });

        if (defVolume === 0) {
            $('#pb-slient-ctrl').addClass('slient');
        }

        $('#pb-slient-ctrl').on('click', function() {
            if ($(this).hasClass('slient')) {
                if (typeof(window.localStorage.getItem("/player/playback/volumeBeforeSlient")) !== "string") {
                    $('#pb_sound_slider').slider2({ "value": 50 });
                    window.localStorage.setItem("/player/playback/volume", 50);
                    setPlayerVolume(50);
                } else {
                    $('#pb_sound_slider').slider2({ "value": window.localStorage.getItem("/player/playback/volumeBeforeSlient") });
                    setPlayerVolume(window.localStorage.getItem("/player/playback/volumeBeforeSlient"));
                    window.localStorage.setItem("/player/playback/volume", window.localStorage.getItem("/player/playback/volumeBeforeSlient"));
                }
                $('#pb-slient-ctrl').removeClass('slient');
            } else {
                $('#pb-slient-ctrl').addClass('slient');
                window.localStorage.setItem("/player/playback/volumeBeforeSlient", $('#pb_sound_slider').slider2('value'));
                $('#pb_sound_slider').slider2({ "value": 0 });
                setPlayerVolume(0);
                window.localStorage.setItem("/player/playback/volume", 0);
            }
        });
        $('#pv-slient-ctrl').on('click', function() {
            if ($(this).hasClass('slient')) {
                if (typeof(window.localStorage.getItem("/player/preview/volumeBeforeSlient")) !== "string") {
                    $('#preview_sound_slid').slider2({ "value": 50 });
                    setPlayerVolume(50);
                    window.localStorage.setItem("/player/preview/volume", 50);
                } else {
                    $('#preview_sound_slid').slider2({ "value": window.localStorage.getItem("/player/preview/volumeBeforeSlient") });
                    setPlayerVolume(window.localStorage.getItem("/player/preview/volumeBeforeSlient"));
                    window.localStorage.setItem("/player/preview/volume", window.localStorage.getItem("/player/preview/volumeBeforeSlient"));
                }
                $('#pv-slient-ctrl').removeClass('slient');
            } else {
                $('#pv-slient-ctrl').addClass('slient');
                window.localStorage.setItem("/player/preview/volumeBeforeSlient", $('#preview_sound_slid').slider2('value'));
                $('#preview_sound_slid').slider2({ "value": 0 });
                setPlayerVolume(0);
                window.localStorage.setItem("/player/preview/volume", 0);
            }
        });

        delete this.initUI;
    };

    // 匹配查找日期
    ControllerFlash.matchDate = function(begin, end, theday) {
        var todayBegin = new Date(theday.getTime());
        todayBegin.setHours(0);
        todayBegin.setMinutes(0);
        todayBegin.setSeconds(0);
        var todayEnd = new Date(todayBegin.getTime() + 86400000);
        if (begin >= todayBegin && begin < todayEnd) {
            return true;
        }
        if (end >= todayBegin && end < todayEnd) {
            return true;
        }
        if (begin >= todayBegin && end < todayEnd) {
            return true;
        }
        return false;
    }

})();