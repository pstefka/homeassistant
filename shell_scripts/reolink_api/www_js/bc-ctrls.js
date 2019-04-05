
function range(b,e) {var r = []; for (i = b; i <= e; ++i) {r.push(i);} return r;}

(function() {
    var _stack = [];
    var _stackData = {};

    _stack.dequeue = function() {
        var r = this.splice(0,1);
        if (r.length) {
            return r[0];
        }
        return undefined;
    };

    window.bc_alert = function (msg, failed, alertId, location) {
        var id = 'alert-' + Math.floor(Math.random() * (new Date()).getTime());
        var $obj;
        if (alertId) {
            id = alertId;
        } else {
            _stack.push(id);
            _stackData[id] = {
                "msg": msg,
                "failed": failed,
                "location": CGI.getLocation()
            }
            if (_stack.length > 1) {
                return ;
            }
        }
        if (location != undefined && location != CGI.getLocation()) {
            (function() {
                var id = _stack.dequeue();
                delete _stackData[id];
                if (_stack.length > 0) {
                    id = _stack[0];
                    bc_alert(_stackData[id].msg, _stackData[id].failed, true, _stackData[id].location);
                }
            })();
            return;
        }
        $('body').append('<div id="' + id + '" class="bc-alert"><div></div><p class="alert-status"></p><p class="alert-msg"></p></div>');
        $obj = $('#' + id);
        if (failed == 'error') {
            $obj.addClass('error');
        }
        if (failed == 'error') {
            $obj.find('p.alert-msg').html(msg);
            $obj.find('p.alert-status').text('Failed');
        } else if (failed == 'ok') {
            $obj.find('p.alert-msg').html(msg);
            $obj.find('p.alert-status').text('Saved');
        } else {
            $obj.find('p.alert-msg').remove();
            $obj.find('p').text('Saved');
        }

        (function($obj) {
            var h = setTimeout(function() {
                $obj.css({"opacity": 0});
                setTimeout(function() {
                    var id = _stack.dequeue();
                    $obj.remove();
                    delete _stackData[id];
                    if (_stack.length > 0) {
                        id = _stack[0];
                        bc_alert(_stackData[id].msg, _stackData[id].failed, true, _stackData[id].location);
                    }
                }, 300);
            }, 3000);
            $obj.css({
                "left": (window.innerWidth - $obj.outerWidth()) / 2,
                "top": (window.innerHeight - $obj.outerHeight()) / 2,
                "opacity": 1
            }).on('click', function() {
                clearTimeout(h);
                $obj.unbind('click');
                $obj.css({"opacity": 0});
                setTimeout(function() {
                    var id = _stack.dequeue();
                    $obj.remove();
                    delete _stackData[id];
                    if (_stack.length > 0) {
                        id = _stack[0];
                        bc_alert(_stackData[id].msg, _stackData[id].failed, true, _stackData[id].location);
                    }
                }, 300);
            });
        })($obj);
    };

})();

/**
 * 用于构造一个每周小时块选择器（Period Picker）
 * 作者：百川视界 曾鹏辉
 * 时间：2016-02-18
 */
function initPeriodPicker($obj) {
    var $es = $obj.find('tbody tr');
    var i = 0, types;
    var ppid = $obj.attr('id');
    var color0;
    var colors = [];
    types = $obj.attr('bc-color-types');
    types = types.split('|');
    for (var j in types) {
        var type = types[j];
        if (typeof(type) != 'string')
            continue;
        type = type.split(':');
        if (j == 0) {
            color0 = type[1];
        }
        colors.push(type[1]);
        var tid = 'color-' + ppid + '-' + type[1];
        $('#' + $obj.attr('id') + '-selector').append('<input type="radio" id="' + tid + '" bc-color="' + type[1] + '" name="color-' + ppid + '"><label style="background: ' + type[1] + ';" for="' + tid + '">' + type[0] + '</label>');
        $('#' + tid).on('click',function() {
            $obj.attr('bc-color', $(this).attr('bc-color'));
        });
    }
    $('#' + $obj.attr('id') + '-selector').find('input[type=radio]:first-child').click();
    i = 0;
    $es.each(function() {
        var j = 0;
        for (; j < 24; j++)
            $(this).append('<td class="ppker-timeblock" bc-day="' + i + '" bc-hour="' + j + '" style="background-color:' + color0 + '" bc-color="' + color0 + '" id="' + ppid + '-' + i + '-' + j + '"></td>');
        i++;
    });
    (function($obj, colors) {
        $obj.on('click', '.ppker-timeblock', function() {
            if ($obj.attr('disabled'))
                return false;
            var i = colors.indexOf($(this).attr('bc-color'));
            if (i == -1) {
                i = 0;
            } else {
                i = (i + 1) % colors.length; 
            }
            $(this).attr('bc-color', colors[i]);
            $(this).css({'background-color': colors[i]});
        });
    })($obj, colors);
    $obj.attr('bc-color', color0);
    (function($obj, $mask) {
        var _beginX, _beginY;
        var _endX, _endY;
        var _dragging = false;
        $obj.on('mousedown', function(e) {
            if ($(this).attr('disabled'))
                return false;
            if (_dragging)
                return;
            if (e.button == 0 && !e.ctrlKey && !e.shiftKey) {
                _beginX = e.clientX - $obj.offset().left;
                _beginY = e.clientY - $obj.offset().top;
                _dragging = true;
            }
        }).on('mouseup', function(e) {
            if (!_dragging)
                return ;
            $mask.hide();
            _endX = e.clientX - $obj.offset().left;
            _endY = e.clientY - $obj.offset().top;
            _dragging = false;
            if (_beginX == _endX && _beginY == _endY) {
                return ;
            }
            var pos0 = {
                "x": Math.min(_beginX, _endX),
                "y": Math.min(_beginY, _endY)
            }, pos1 = {
                "x": Math.max(_beginX, _endX),
                "y": Math.max(_beginY, _endY)
            }, beginPos = null, endPos = null;
            function chkPointInRange(point, pos0, pos1) {
                if (point.x >= pos0.x && point.x <= pos1.x) {
                    if (point.y >= pos0.y && point.y <= pos1.y)
                        return true;
                }
                return false;
            }
            function chkBlockInRange($block, pos0, pos1) {
                var x = $block.offset().left - $obj.offset().left;
                var y = $block.offset().top - $obj.offset().top;
                if (chkPointInRange(pos0, {
                    "x": x,
                    "y": y
                }, {
                    "x": x + $block.width(),
                    "y": y + $block.height()
                })) {
                    beginPos = {
                        "x": parseInt($block.attr('bc-hour')),
                        "y": parseInt($block.attr('bc-day'))
                    };
                }
                if (chkPointInRange(pos1, {
                    "x": x,
                    "y": y
                }, {
                    "x": x + $block.width(),
                    "y": y + $block.height()
                })) {
                    endPos = {
                        "x": parseInt($block.attr('bc-hour')),
                        "y": parseInt($block.attr('bc-day'))
                    };
                }
            }
            $obj.find('.ppker-timeblock').each(function() {
                chkBlockInRange($(this), pos0, pos1);
            });
            if (endPos !== null && beginPos !== null) {
                for (i = beginPos.y; i <= endPos.y; i++) {
                    for (var j = beginPos.x; j <= endPos.x; j++) {
                        $obj.find('.ppker-timeblock[bc-day=' + i + '][bc-hour=' + j + ']')
                        .attr('bc-color', $obj.attr('bc-color'))
                        .css({'background-color': $obj.attr('bc-color')});
                    }
                }
            }

        }).on('mousemove', function(e) {
            if (!_dragging)
                return;
            _endX = e.clientX - $obj.offset().left;
            _endY = e.clientY - $obj.offset().top;
            if (!$mask.is(':visible'))
                $mask.show();
            $mask.css({
                "left": $obj.offset().left + Math.min(_beginX, _endX) - $('.remote-main-view').offset().left,
                "top": $obj.offset().top + Math.min(_beginY, _endY) + $('.remote-main-view').scrollTop() - $('.remote-main-view').offset().top,
                "width": Math.max(_beginX, _endX) - Math.min(_beginX, _endX),
                "height": Math.max(_beginY, _endY) - Math.min(_beginY, _endY)
            });
        });
    })($obj, $obj.find('div.period-picker-mask'));
}

/**
 * 根据描述字符串对时间选择器进行赋值。
 */
function bitbltPeriodPicker($obj, dat) {
    var tmp, map = {};

    tmp = $obj.attr('bc-color-types');
    tmp = tmp.split('|');
    for (var j in tmp) {
        var type = tmp[j];
        if (typeof(type) != 'string')
            continue;
        type = type.split(':');
        map[type[2]] = type[1];
    }

    for (var i = 0; i < 7; i++) {
        for (var t = 0; t < 24; t++) {
            var color = map[dat[i * 24 + t]];
            var $block = $obj.find('[bc-day=' + i + '][bc-hour=' + t + ']');
            $block.attr('bc-color', color).css({
                "background-color": color
            });
        }
    }
}

/**
 * 获取时间选择器的值。
 */
function getPeriodPickerBits($obj) {
    var tmp, map = {};

    tmp = $obj.attr('bc-color-types');
    tmp = tmp.split('|');
    for (var j in tmp) {
        var type = tmp[j];
        if (typeof(type) != 'string')
            continue;
        type = type.split(':');
        map[type[1]] = type[2];
    }

    tmp = '';
    for (var i = 0; i < 7; i++) {
        for (var t = 0; t < 24; t++) {
            var color = $obj.find('[bc-day=' + i + '][bc-hour=' + t + ']').attr('bc-color');
            tmp += map[color];
        }
    }
    return tmp;
}

function onBindedVisibleClick() {
    var Ids = $(this).attr('bc-bind-visible');
    Ids = Ids.split('|');
    if ($(this).is(':checked')) {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).show();
        });
    } else {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).hide();
        });
    }
}

function onBindedValue2Text() {
    var Ids = $(this).attr('bc-bind-value-to-text');
    Ids = Ids.split('|');
    (function($this) {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).text($this.val());
        });
    })($(this));
}

function onBindedInvisibleClick() {
    var Ids = $(this).attr('bc-bind-invisible');
    Ids = Ids.split('|');
    if ($(this).is(':checked')) {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).hide();
        });
    } else {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).show();
        });
    }
}

function onBindedDisablerClick() {
    var Ids = $(this).attr('bc-bind-disable');
    Ids = Ids.split('|');
    if ($(this).is(':checked')) {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).attr('disabled', true);
        });
    } else {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).removeAttr('disabled');
        });
    }
}

function onBindedEnablerClick() {
    var Ids = $(this).attr('bc-bind-enable');
    Ids = Ids.split('|');
    if ($(this).is(':checked')) {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).removeAttr('disabled');
        });
    } else {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).attr('disabled', true);
        });
    }
}

function onShowPasswordClick() {
    var Ids = $(this).attr('bc-bind-show-password');
    Ids = Ids.split('|');
    if ($(this).is(':checked')) {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).attr('type', 'text');
        });
    } else {
        $(Ids).each(function() {
            if (this.length)
                $('#' + this).attr('type', 'password');
        });
    }
}

function bindEnabler($checkbox) {
    $checkbox.each(function() {
        if ($(this).attr('bc-bind-enable')) {
            onBindedEnablerClick.call(this);
            $(this).on('click', onBindedEnablerClick);
        }
    });
};

function bindDisabler($checkbox) {
    $checkbox.each(function() {
        if ($(this).attr('bc-bind-disable')) {
            onBindedDisablerClick.call(this);
            $(this).on('click', onBindedDisablerClick);
        }
    });
};

function bindVisibler($checkbox) {
    $checkbox.each(function() {
        if ($(this).attr('bc-bind-visible')) {
            onBindedVisibleClick.call(this);
            $(this).on('click', onBindedVisibleClick);
        }
    });
};

function bindInvisibler($checkbox) {
    $checkbox.each(function() {
        if ($(this).attr('bc-bind-invisible')) {
            onBindedInvisibleClick.call(this);
            $(this).on('click', onBindedInvisibleClick);
        }
    });
};

function bindValue2Text($textbox) {
    $textbox.each(function() {
        if ($(this).attr('bc-bind-value-to-text')) {
            onBindedValue2Text.call(this);
            $(this).on('keydown', onBindedValue2Text).on('keyup', onBindedValue2Text).on('change', onBindedValue2Text);
        }
    });
};

function bindShowPassword($textbox) {
    $textbox.each(function() {
        if ($(this).attr('bc-bind-show-password')) {
            $(this).on('click', onShowPasswordClick);
        }
    });
};

