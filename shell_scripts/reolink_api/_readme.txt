# use - https://ipcamtalk.com/threads/reolink-ipcamera-api.24963/

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

# position
# set position
curl -d '[{"cmd":"PtzCtrl","action":0,"param":{"channel":0,"op":"ToPos","speed":32,"id":2}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=PtzCtrl&token=b29107d43ea5156

# email
"interval" [30 Seconds,1 Minute,5 Minutes,10 Minutes,30 Minutes]
"attachment" [picture,video,onlyPicture]

# get email state
curl -d '[{"cmd":"GetEmail","action":1,"param":{}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=GetEmail&token=b29107d43ea5156

# set email state
curl -d '[{"cmd":"SetEmail","action":0,"param":{"Email":{"smtpServer":"smtp.gmail.com","nickName":"BudaBuda","smtpPort":465,"userName":"budabudabot@gmail.com","password":"5T0*^hQJhG9kuhPd","addr1":"budabudabot@gmail.com","addr2":"","addr3":"","interval":"5 Minutes","ssl":1,"attachment":"picture","schedule":{"enable":1,"table":"111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"}}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetEmail&token=b29107d43ea5156

curl -d '[{"cmd":"SetEmail","action":0,"param":{"Email":{{"addr1":"budabudabot@gmail.com","addr2":"","addr3":"","attachment":"picture","interval":"10 Minutes","nickName":"BudaBuda","password":"5T0*^hQJhG9kuhPd","schedule":{"enable":1,"table":"111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"smtpPort":465,"smtpServer":"smtp.gmail.com","ssl":1,"userName":"budabudabot@gmail.com"}}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetEmail&token=b29107d43ea5156

# all
"antiFlicker" [Outdoor, 50HZ, 60HZ, Off]
"exposure" [Auto, LowNoise, Anti-Smearing, Manual]
  LowNoise -> gain
  Anti-Smearing -> shutter
  Manual -> gain + shutter
"gain" <1,100>
"shutter" <0,125>
"whiteBalance" [Auto, Manual]
  Manual -> blueGain, redGain
"blueGain" <0,255>
"redGain" <0,255>
"dayNight" [Auto, Color, Black&White]
"backLight" [Off, BackLightControl, DynamicRangeControl]
  BackLightControl -> blc
  DynamicRangeControl -> drc
"blc" <0,255>
"drc" <0,255>
"rotation" [0, 1]
"mirroring" [0, 1]
"nr3d" [0, 1]

# color = black & white
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Black&White","backLight":"Off","blc":255,"drc":0,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135

# color = color
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Color","backLight":"Off","blc":255,"drc":0,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135

# color = auto
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Auto","backLight":"Off","blc":255,"drc":0,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135

# backlight Back-light
# blc <0,255>
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Black&White","backLight":"BackLightControl","blc":139,"drc":152,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135

# backlight Dynamic Range
# drc <0,255>
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Auto","backLight":"DynamicRangeControl","blc":139,"drc":152,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135

# backlight off
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Auto","backLight":"Off","blc":139,"drc":152,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135

# ir on
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Auto","backLight":"BackLightControl","blc":139,"drc":152,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIrLights&token=e692e7e998d3135
curl -d '[{"cmd":"SetIrLights","action":0,"param":{"IrLights":{"state":"Auto"}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIrLights&token=e692e7e998d3135

# ir off
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"60HZ","exposure":"Auto","gain":{"min":1,"max":66},"shutter":{"min":0,"max":0},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Auto","backLight":"BackLightControl","blc":139,"drc":152,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIrLights&token=e692e7e998d3135
curl -d '[{"cmd":"SetIrLights","action":0,"param":{"IrLights":{"state":"Off"}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIrLights&token=e692e7e998d3135

# default
curl -d '[{"cmd":"SetIsp","action":0,"param":{"Isp":{"channel":0,"antiFlicker":"Off","exposure":"Auto","gain":{"min":1,"max":62},"shutter":{"min":0,"max":125},"blueGain":128,"redGain":128,"whiteBalance":"Auto","dayNight":"Auto","backLight":"Off","blc":128,"drc":128,"rotation":0,"mirroring":0,"nr3d":1}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIsp&token=e692e7e998d3135
curl -d '[{"cmd":"SetIrLights","action":0,"param":{"IrLights":{"state":"Off"}}}]' http://192.168.1.253/cgi-bin/api.cgi?cmd=SetIrLights&token=e692e7e998d3135

# get initial state
curl -d '[{"cmd":"GetIrLights","action":1,"param":{}},{"cmd":"GetOsd","action":1,"param":{"channel":0}},{"cmd":"GetEnc","action":1,"param":{"channel":0}},{"cmd":"GetImage","action":1,"param":{"channel":0}},{"cmd":"GetIsp","action":1,"param":{"channel":0}},{"cmd":"GetPtzPatrol","action":1,"param":{"channel":0}},{"cmd":"GetPtzPreset","action":1,"param":{"channel":0}}]' http://192.168.1.253/cgi-bin/api.cgi?token=ffa618b51167013

-> response
[
   {
      "cmd" : "GetIrLights",
      "code" : 0,
      "initial" : {
         "IrLights" : {
            "state" : "Auto"
         }
      },
      "range" : {
         "IrLights" : {
            "state" : [ "Auto", "Off" ]
         }
      },
      "value" : {
         "IrLights" : {
            "state" : "Off"
         }
      }
   },
   {
      "cmd" : "GetOsd",
      "code" : 0,
      "initial" : {
         "Osd" : {
            "bgcolor" : 0,
            "channel" : 0,
            "osdChannel" : {
               "enable" : 1,
               "name" : "Camera1",
               "pos" : "Lower Right"
            },
            "osdTime" : {
               "enable" : 1,
               "pos" : "Top Center"
            },
            "watermark" : 1
         }
      },
      "range" : {
         "Osd" : {
            "bgcolor" : "boolean",
            "channel" : 0,
            "osdChannel" : {
               "enable" : "boolean",
               "name" : {
                  "maxLen" : 31
               },
               "pos" : [
                  "Upper Left",
                  "Top Center",
                  "Upper Right",
                  "Lower Left",
                  "Bottom Center",
                  "Lower Right"
               ]
            },
            "osdTime" : {
               "enable" : "boolean",
               "pos" : [
                  "Upper Left",
                  "Top Center",
                  "Upper Right",
                  "Lower Left",
                  "Bottom Center",
                  "Lower Right"
               ]
            },
            "watermark" : "boolean"
         }
      },
      "value" : {
         "Osd" : {
            "bgcolor" : 0,
            "channel" : 0,
            "osdChannel" : {
               "enable" : 0,
               "name" : "C1pro",
               "pos" : "Lower Right"
            },
            "osdTime" : {
               "enable" : 1,
               "pos" : "Top Center"
            },
            "watermark" : 0
         }
      }
   },
   {
      "cmd" : "GetEnc",
      "code" : 0,
      "initial" : {
         "Enc" : {
            "audio" : 1,
            "channel" : 0,
            "mainStream" : {
               "bitRate" : 3072,
               "frameRate" : 15,
               "profile" : "High",
               "size" : "2560*1440"
            },
            "subStream" : {
               "bitRate" : 160,
               "frameRate" : 6,
               "profile" : "High",
               "size" : "640*360"
            }
         }
      },
      "range" : {
         "Enc" : [
            {
               "audio" : "boolean",
               "mainStream" : {
                  "bitRate" : [ 1024, 1536, 2048, 3072, 4096, 5120, 6144, 7168, 8192 ],
                  "default" : {
                     "bitRate" : 3072,
                     "frameRate" : 15
                  },
                  "frameRate" : [ 25, 22, 20, 18, 16, 15, 12, 10, 8, 6, 4, 2 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "2560*1440"
               },
               "subStream" : {
                  "bitRate" : [ 64, 128, 160, 192, 256, 384, 512 ],
                  "default" : {
                     "bitRate" : 160,
                     "frameRate" : 6
                  },
                  "frameRate" : [ 12, 8, 6, 4 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "640*360"
               }
            },
            {
               "audio" : "boolean",
               "mainStream" : {
                  "bitRate" : [ 1024, 1536, 2048, 3072, 4096, 5120, 6144, 7168, 8192 ],
                  "default" : {
                     "bitRate" : 3072,
                     "frameRate" : 15
                  },
                  "frameRate" : [ 25, 22, 20, 18, 16, 15, 12, 10, 8, 6, 4, 2 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "2304*1296"
               },
               "subStream" : {
                  "bitRate" : [ 64, 128, 160, 192, 256, 384, 512 ],
                  "default" : {
                     "bitRate" : 160,
                     "frameRate" : 6
                  },
                  "frameRate" : [ 12, 8, 6, 4 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "640*360"
               }
            },
            {
               "audio" : "boolean",
               "mainStream" : {
                  "bitRate" : [ 1024, 1536, 2048, 3072, 4096, 5120, 6144, 7168, 8192 ],
                  "default" : {
                     "bitRate" : 2048,
                     "frameRate" : 15
                  },
                  "frameRate" : [ 25, 22, 20, 18, 16, 15, 12, 10, 8, 6, 4, 2 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "1080P"
               },
               "subStream" : {
                  "bitRate" : [ 64, 128, 160, 192, 256, 384, 512 ],
                  "default" : {
                     "bitRate" : 160,
                     "frameRate" : 6
                  },
                  "frameRate" : [ 12, 8, 6, 4 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "640*360"
               }
            },
            {
               "audio" : "boolean",
               "mainStream" : {
                  "bitRate" : [ 512, 768, 1024, 1536, 2048, 3072, 4096, 5120 ],
                  "default" : {
                     "bitRate" : 3072,
                     "frameRate" : 25
                  },
                  "frameRate" : [ 25, 22, 20, 18, 16, 15, 12, 10, 8, 6, 4, 2 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "720P"
               },
               "subStream" : {
                  "bitRate" : [ 64, 128, 160, 192, 256, 384, 512 ],
                  "default" : {
                     "bitRate" : 160,
                     "frameRate" : 6
                  },
                  "frameRate" : [ 12, 8, 6, 4 ],
                  "profile" : [ "Base", "Main", "High" ],
                  "size" : "640*360"
               }
            }
         ]
      },
      "value" : {
         "Enc" : {
            "audio" : 1,
            "channel" : 0,
            "mainStream" : {
               "bitRate" : 6144,
               "frameRate" : 10,
               "profile" : "High",
               "size" : "2560*1440"
            },
            "subStream" : {
               "bitRate" : 256,
               "frameRate" : 12,
               "profile" : "Base",
               "size" : "640*360"
            }
         }
      }
   },
   {
      "cmd" : "GetImage",
      "code" : 0,
      "initial" : {
         "Image" : {
            "bright" : 128,
            "channel" : 0,
            "contrast" : 128,
            "hue" : 128,
            "saturation" : 128,
            "sharpen" : 128
         }
      },
      "range" : {
         "Image" : {
            "bright" : {
               "max" : 255,
               "min" : 0
            },
            "channel" : 0,
            "contrast" : {
               "max" : 255,
               "min" : 0
            },
            "hue" : {
               "max" : 255,
               "min" : 0
            },
            "saturation" : {
               "max" : 255,
               "min" : 0
            },
            "sharpen" : {
               "max" : 255,
               "min" : 0
            }
         }
      },
      "value" : {
         "Image" : {
            "bright" : 128,
            "channel" : 0,
            "contrast" : 128,
            "hue" : 128,
            "saturation" : 128,
            "sharpen" : 128
         }
      }
   },
   {
      "cmd" : "GetIsp",
      "code" : 0,
      "initial" : {
         "Isp" : {
            "antiFlicker" : "Off",
            "backLight" : "Off",
            "blc" : 128,
            "blueGain" : 255,
            "channel" : 0,
            "dayNight" : "Auto",
            "drc" : 128,
            "exposure" : "Auto",
            "gain" : {
               "max" : 62,
               "min" : 1
            },
            "mirroring" : 0,
            "nr3d" : 1,
            "redGain" : 255,
            "rotation" : 0,
            "shutter" : {
               "max" : 125,
               "min" : 0
            },
            "whiteBalance" : "Auto"
         }
      },
      "range" : {
         "Isp" : {
            "antiFlicker" : [ "Outdoor", "50HZ", "60HZ", "Off" ],
            "backLight" : [ "Off", "BackLightControl", "DynamicRangeControl" ],
            "blc" : {
               "max" : 255,
               "min" : 0
            },
            "blueGain" : {
               "max" : 255,
               "min" : 0
            },
            "channel" : 0,
            "dayNight" : [ "Auto", "Color", "Black&White" ],
            "drc" : {
               "max" : 255,
               "min" : 0
            },
            "exposure" : [ "Auto", "LowNoise", "Anti-Smearing", "Manual" ],
            "gain" : {
               "max" : 100,
               "min" : 1
            },
            "mirroring" : "boolean",
            "nr3d" : "boolean",
            "redGain" : {
               "max" : 255,
               "min" : 0
            },
            "rotation" : "boolean",
            "shutter" : {
               "max" : 125,
               "min" : 0
            },
            "whiteBalance" : [ "Auto", "Manual" ]
         }
      },
      "value" : {
         "Isp" : {
            "antiFlicker" : "Outdoor",
            "backLight" : "Off",
            "blc" : 139,
            "blueGain" : 255,
            "channel" : 0,
            "dayNight" : "Auto",
            "drc" : 0,
            "exposure" : "Auto",
            "gain" : {
               "max" : 100,
               "min" : 1
            },
            "mirroring" : 0,
            "nr3d" : 1,
            "redGain" : 255,
            "rotation" : 0,
            "shutter" : {
               "max" : 109,
               "min" : 0
            },
            "whiteBalance" : "Auto"
         }
      }
   },
   {
      "cmd" : "GetPtzPatrol",
      "code" : 0,
      "range" : {
         "PtzPatrol" : {
            "enable" : "boolean",
            "id" : {
               "max" : 1,
               "min" : 1
            },
            "preset" : {
               "dwellTime" : {
                  "max" : 30,
                  "min" : 1
               },
               "id" : {
                  "max" : 64,
                  "min" : 1
               },
               "speed" : {
                  "max" : 64,
                  "min" : 1
               }
            },
            "running" : "boolean"
         }
      },
      "value" : {
         "PtzPatrol" : [
            {
               "channel" : 0,
               "enable" : 1,
               "id" : 1,
               "preset" : null,
               "running" : 0
            }
         ]
      }
   },
   {
      "cmd" : "GetPtzPreset",
      "code" : 0,
      "range" : {
         "PtzPreset" : {
            "channel" : 0,
            "enable" : "boolean",
            "id" : {
               "max" : 64,
               "min" : 1
            },
            "name" : {
               "maxLen" : 31
            }
         }
      },
      "value" : {
         "PtzPreset" : [
            {
               "channel" : 0,
               "enable" : 1,
               "id" : 1,
               "name" : "outside with cars"
            },
            {
               "channel" : 0,
               "enable" : 1,
               "id" : 2,
               "name" : "outside sky"
            },
            {
               "channel" : 0,
               "enable" : 1,
               "id" : 3,
               "name" : "outside car"
            },
            {
               "channel" : 0,
               "enable" : 1,
               "id" : 4,
               "name" : "inside baby"
            },
            {
               "channel" : 0,
               "enable" : 1,
               "id" : 5,
               "name" : "inside door"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 6,
               "name" : "pos6"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 7,
               "name" : "pos7"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 8,
               "name" : "pos8"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 9,
               "name" : "pos9"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 10,
               "name" : "pos10"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 11,
               "name" : "pos11"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 12,
               "name" : "pos12"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 13,
               "name" : "pos13"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 14,
               "name" : "pos14"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 15,
               "name" : "pos15"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 16,
               "name" : "pos16"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 17,
               "name" : "pos17"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 18,
               "name" : "pos18"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 19,
               "name" : "pos19"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 20,
               "name" : "pos20"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 21,
               "name" : "pos21"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 22,
               "name" : "pos22"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 23,
               "name" : "pos23"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 24,
               "name" : "pos24"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 25,
               "name" : "pos25"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 26,
               "name" : "pos26"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 27,
               "name" : "pos27"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 28,
               "name" : "pos28"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 29,
               "name" : "pos29"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 30,
               "name" : "pos30"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 31,
               "name" : "pos31"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 32,
               "name" : "pos32"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 33,
               "name" : "pos33"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 34,
               "name" : "pos34"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 35,
               "name" : "pos35"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 36,
               "name" : "pos36"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 37,
               "name" : "pos37"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 38,
               "name" : "pos38"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 39,
               "name" : "pos39"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 40,
               "name" : "pos40"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 41,
               "name" : "pos41"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 42,
               "name" : "pos42"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 43,
               "name" : "pos43"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 44,
               "name" : "pos44"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 45,
               "name" : "pos45"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 46,
               "name" : "pos46"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 47,
               "name" : "pos47"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 48,
               "name" : "pos48"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 49,
               "name" : "pos49"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 50,
               "name" : "pos50"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 51,
               "name" : "pos51"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 52,
               "name" : "pos52"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 53,
               "name" : "pos53"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 54,
               "name" : "pos54"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 55,
               "name" : "pos55"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 56,
               "name" : "pos56"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 57,
               "name" : "pos57"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 58,
               "name" : "pos58"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 59,
               "name" : "pos59"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 60,
               "name" : "pos60"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 61,
               "name" : "pos61"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 62,
               "name" : "pos62"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 63,
               "name" : "pos63"
            },
            {
               "channel" : 0,
               "enable" : 0,
               "id" : 64,
               "name" : "pos64"
            }
         ]
      }
   }
]


