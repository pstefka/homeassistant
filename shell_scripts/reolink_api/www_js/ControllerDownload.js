
function ControllerDownload() {
	throw {"msg": "Don't NEW a singleton."};
}

ControllerDownload.show = function (chId) {
    this.init && this.init();
    this.resize();

    ControllerDownload.refresh(chId);
    $('#download-dialog').show();
};

ControllerDownload.hide = function () {
    $('#download-dialog').hide();
};

ControllerDownload.resize = function () {
    $('#download-dialog').css({
        "height": window.innerHeight,
        "width": window.innerWidth
    });
    $('#download-dialog .bc-dialog').css({
        "top": (window.innerHeight - $('#download-dialog .bc-dialog').innerHeight()) / 2,
        "left": (window.innerWidth - $('#download-dialog .bc-dialog').innerWidth()) / 2
    });
};

ControllerDownload.refresh = function (chId) {
    var files = g_device.channels[chId].playbackFiles;
    $('#download-channel-id').text(chId + 1);
    $('#download-file-list').html('');

    if ($('#download-select-all').is(':checked')) {
        $('#download-select-all').click();
    }

    $('#download-date').text(PlayerPlayback.bcDatePicker.getSearchDate().getUnixDateOnly());
    if (files && files.length > 0) {
        for (var i = 0; i < files.length; ++i) {
            this.addFile(files[i]);
        }
    }

    $('#download-do').attr('disabled', true);

    setTimeout(function() {
        $('#download-file-list-header .dl-row-file-size').css({
            "margin-right": $('#download-file-list-header').innerWidth() - $('#download-file-list > div').outerWidth()
        });
    }, 0);
};

ControllerDownload.addFile = function (file) {
    var $obj = $('#download-file-list');
    var size = String.formatSize(file.size, 1);

    var displayName = file.fileName.replace(/_\d{8}_\d{6}_/, '_' + file.startTime.getUnixDateOnly().replace(/\-/g, '') + '_' + file.startTime.getUnixTimeOnly().replace(/\:/g, '') + '_');
    var html = '<div><div><input name="select-download" type="' + this.inputType + '"></div>';
    html += '<div class="dl-row-name" real-name="' + file.fileName + '">' + displayName + '</div>';
    html += '<div class="dl-row-begin-time" title="' + file.startTime.getUnixDate() + '">' + file.startTime.getUnixTimeOnly() + '</div>';
    html += '<div class="dl-row-end-time" title="' + file.endTime.getUnixDate() + '">' + file.endTime.getUnixTimeOnly() + '</div>';
    html += '<div class="dl-row-file-size">' + size.num + ' ' + size.unit + '</div></div>';
    $obj.append(html);
};

ControllerDownload.init = function () {
    $('#download-dialog').on('click', function(e) {
        if (e.target.id == 'download-dialog') {
            ControllerDownload.hide();
        }
    });

    this.status = 'idle';

    $('#download-dialog').find('.bc-dialog-close').on('click', function() {
        ControllerDownload.hide();
    });
    if (ControllerLogin.isIE || isSafari()) {
        this.inputType = 'radio';
        $('#download-select-all').attr('disabled', true);
    } else {
        this.inputType = 'checkbox';
        $('#download-select-all').on('click', function() {
            var checked = $(this).is(':checked');
            $('#download-file-list input').each(function() {
                if ($(this).is(':checked') != checked) {
                    $(this).click();
                }
            })
        });
    }
    $('#download-file-list').on('click', 'input', function () {
        if ($('#download-file-list input:checked').length == 0 && !ControllerLogin.isIE) {
            $('#download-do').attr('disabled', true);
        } else {
            $('#download-do').removeAttr('disabled');
        }
    });
    $('#download-file-list').on('click', '>div>div:nth-child(n+2)', function () {
        $(this).parent().find('input').click();
    });
    $('#download-do').on('click', function() {

        $(this).attr('disabled', true);
        $('#download-file-list input:checked').each(function() {

            var elemIF = document.createElement("iframe");
            var $nameObj = $(this).parent().parent().find('.dl-row-name');

            elemIF.id = String.random(32);
            elemIF.src = window.location.protocol + '//' + window.location.host + '/cgi-bin/api.cgi?cmd=Download&source=' + $nameObj.attr('real-name') + '&output=' + $nameObj.text() + '&token=' + localStorage.getItem('token');
            elemIF.style.display = "none";

            document.body.appendChild(elemIF);

        });
        $(this).removeAttr('disabled');
    });
    delete this.init;
};
