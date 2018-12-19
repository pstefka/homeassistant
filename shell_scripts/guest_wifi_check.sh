#!/bin/bash

#ssh root@192.168.11.10 -p 24584 /root/scripts/guest_wifi_check.sh

if ssh root@192.168.11.10 -p 24584 "uci show wireless.guest > /dev/null 2>&1" ; then
  echo "enabled"
else
  echo "disabled"
fi


