#!/bin/sh

arg="$1"
arg2=$2

case "$arg" in

    power|Power|POWER)
        if [ $arg2 = "on" ] || [ $arg2 = "On" ] || [ $arg2 = "ON" ] ; then
        curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X PUT -d '{"Operation" : {"power" : "On"}}' https://192.168.1.250:8888/devices/0
        fi
        if [ $arg2 = "off" ] || [ $arg2 = "Off" ] || [ $arg2 = "OFF" ] ; then
        curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X PUT -d '{"Operation" : {"power" : "Off"}}' https://192.168.1.250:8888/devices/0
        fi
        ;;
    wind|Wind|WIND)
        if [ $arg2 = "all" ] || [ $arg2 = "All" ] || [ $arg2 = "ALL" ] ; then
        curl -s -X PUT -d '{"direction": "All"}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/wind
        fi
        if [ $arg2 = "verical" ] || [ $arg2 = "Vertical" ] || [ $arg2 = "VERTICAL" ] ; then
        curl -s -X PUT -d '{"direction": "Up_And_Low"}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/wind
        fi
        if [ $arg2 = "horizontal" ] || [ $arg2 = "Horizontal" ] || [ $arg2 = "HORIZONTAL" ] ; then
        curl -s -X PUT -d '{"direction": "Left_And_Right"}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/wind
        fi
        if [ $arg2 = "fix" ] || [ $arg2 = "Fix" ] || [ $arg2 = "FIX" ] ; then
        curl -s -X PUT -d '{"direction": "Fix"}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/wind    
        fi
        ;;
    temperature|Temperature|TEMPERATURE)
        if [ $arg2 = "20" ] ; then
        curl -s -X PUT -d '{"desired": 20}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "21" ] ; then
        curl -s -X PUT -d '{"desired": 21}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "22" ] ; then
        curl -s -X PUT -d '{"desired": 22}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "23" ] ; then
        curl -s -X PUT -d '{"desired": 23}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "24" ] ; then
        curl -s -X PUT -d '{"desired": 24}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "25" ] ; then
        curl -s -X PUT -d '{"desired": 25}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "26" ] ; then
        curl -s -X PUT -d '{"desired": 26}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "27" ] ; then
        curl -s -X PUT -d '{"desired": 27}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "28" ] ; then
        curl -s -X PUT -d '{"desired": 28}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "29" ] ; then
        curl -s -X PUT -d '{"desired": 29}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        if [ $arg2 = "30" ] ; then
        curl -s -X PUT -d '{"desired": 30}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/temperatures/0
        fi
        ;;
        mode|Mode|MODE)
        if [ $arg2 = "cool" ] || [ $arg2 = "Cool" ] || [ $arg2 = "COOL" ] ; then
        curl -s -X PUT -d '{"modes": ["Cool"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "dry" ] || [ $arg2 = "Dry" ] || [ $arg2 = "DRY" ] ; then
        curl -s -X PUT -d '{"modes": ["Dry"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "wind" ] || [ $arg2 = "Wind" ] || [ $arg2 = "WIND" ] ; then
        curl -s -X PUT -d '{"modes": ["Wind"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "auto" ] || [ $arg2 = "Auto" ] || [ $arg2 = "AUTO" ] ; then
        curl -s -X PUT -d '{"modes": ["Auto"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "heat" ] || [ $arg2 = "Heat" ] || [ $arg2 = "HEAT" ] ; then
        curl -s -X PUT -d '{"modes": ["Heat"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        ;;
        purify|Purify|Purify)
        if [ $arg2 = "on" ] || [ $arg2 = "On" ] || [ $arg2 = "ON" ] ; then
        curl -s -X PUT -d '{"options": ["Spi_On"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "off" ] || [ $arg2 = "Off" ] || [ $arg2 = "OFF" ] ; then
        curl -s -X PUT -d '{"options": ["Spi_Off"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        ;;
        goodsleep|Goodsleep|GOODSLEEP)
        if [ $arg2 = "1" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_2"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "2" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_4"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "3" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_6"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "4" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_8"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "5" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_10"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "6" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_12"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "7" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_14"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "8" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_16"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "9" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_18"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        if [ $arg2 = "10" ] ; then
        curl -s -X PUT -d '{"options": ["Sleep_20"]}' -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure https://192.168.1.250:8888/devices/0/mode
        fi
        ;;
esac

sleep 5

curl -s -X POST --header "Content-Type: text/plain" --header "Accept: application/json" -d "status" "http://localhost:8080/rest/items/SamsungAC_Input"

power=`curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X GET https://192.168.1.250:8888/devices|jq '.Devices[0].Operation.power'`
mode=`curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X GET https://192.168.1.250:8888/devices|jq '.Devices[0].Mode.modes[0]'`
purify=`curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X GET https://192.168.1.250:8888/devices|jq '.Devices[0].Mode.options[3]'`
goodsleep=`curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X GET https://192.168.1.250:8888/devices|jq '.Devices[0].Mode.options[1]'`
temperature=`curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X GET https://192.168.1.250:8888/devices|jq '.Devices[0].Temperatures[0].current'`
desired=`curl -s -k -H "Content-Type: application/json" -H "Authorization: Bearer 3E29WItMSX" --cert all.pem --insecure -X GET https://192.168.1.250:8888/devices|jq '.Devices[0].Temperatures[0].desired'`

echo "Power: $power";
echo "Mode: $mode";
echo "Purify: $purify";
echo "Temperature: $temperature°C";
echo "Desired: $desired°C";
echo "Good sleep: $goodsleep";
