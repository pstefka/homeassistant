#!/bin/bash

#ssh root@192.168.11.10 -p 24584 /root/scripts/guest_wifi_add.sh
ssh root@192.168.11.10 -p 24584 "uci set wireless.guest=wifi-iface; uci set wireless.guest.device='radio0'; uci set wireless.guest.mode='ap'; uci set wireless.guest.network='guest'; uci set wireless.guest.encryption='psk-mixed'; uci set wireless.guest.key='tajneheslo'; uci set wireless.guest.isolate='1'; uci set wireless.guest.ssid='Belasa Slachta G'; uci commit wireless; wifi" 

