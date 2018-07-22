#!/bin/bash

#ssh root@192.168.11.10 -p 24584 /root/scripts/guest_wifi_remove.sh
ssh root@192.168.11.10 -p 24584 "uci delete wireless.guest; uci commit wireless; wifi"

