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
# color 
cmd=SetIsp, "dayNight": "Black&White"
# backlight
cmd=SetIsp, "backLight": "Off"

