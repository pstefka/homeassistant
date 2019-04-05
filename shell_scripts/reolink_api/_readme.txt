# get token
curl -m 1 -d '[{"cmd":"Login","action":0,"param":{"User":{"userName":"admin","password":"662013"}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=Login&token=null

[
   {
      "cmd" : "Login",
      "code" : 0,
      "value" : {
         "Token" : {
            "leaseTime" : 3600,
            "name" : "5aaeb4eba3b4f8b"
         }
      }
   }
]

-> name = token

# use - https://ipcamtalk.com/threads/reolink-ipcamera-api.24963/
# PTZ
curl -d '[{"cmd":"PtzCtrl","action":0,"param":{"channel":0,"op":"ToPos","speed":32,"id":1}}]' http://192.168.1.253/cgi-bin/api.cgi?token=2c773e0d55b5d96
# motion detection
cmd=SetIsp?
curl -d '[{"cmd":"SetIsp","action":0,"param":{
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
}}]' http://192.168.1.253/cgi-bin/api.cgi?token=2c773e0d55b5d96

curl -d '[{"cmd":"SetIsp","action":0,"param":{
"Isp": {
                    "channel": 0,
                    "dayNight": $('#pv-daynight').val(),
                    "backLight": $('#pv-backlight').val()
}
}}]' http://192.168.1.253/cgi-bin/api.cgi?token=2c773e0d55b5d96
# color 
cmd=SetIsp, "dayNight": "Black&White"
# backlight
cmd=SetIsp, "backLight": "Off"

