#!/bin/bash

export PATH="/config/adb:/bin"

ip_check=$1
debug=$2

if [ ! $ip_check ]; then
  # TV IP
  ip_check='192.168.1.4'
fi

if [ "$debug" ]; then
  date
  echo $ip_check
fi

if [ "$debug" ]; then
  adb connect $ip_check
  sleep 1
  adb shell dumpsys power | grep 'mWakefulness=Awake'
  # Awake | Asleep
else
  adb connect $ip_check &> /dev/null
  sleep 1
  adb shell dumpsys power | grep 'mWakefulness=Awake' &> /dev/null
fi

if [ $? -eq 0 ]; then
  echo OK
else
  echo FAIL
fi

if [ "$debug" ]; then
  echo "----------------------"
fi

adb disconnect &> /dev/null


