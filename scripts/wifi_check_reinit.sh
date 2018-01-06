#!/bin/bash

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

ip_arp_check=$1
debug=$2

if [ ! $ip_arp_check ]; then
  # TV IP
  ip_arp_check='192.168.1.6'
fi

if [ "$debug" ]; then
  date
  echo $ip_arp_check
fi

#remove arp entry
sudo arp -d $ip_arp_check &> /dev/null

#get a new arp entry, no need to display the ping result
#ping -c 1 -q $ip_arp_check
ping -c 1 -q $ip_arp_check &> /dev/null

if [ "$debug" ]; then
  echo "-"
  sudo arp -d $ip_arp_check
  echo "-"
  ping -c 5 -t 2 -q $ip_arp_check
  echo "-"
  arp -a
  echo "-"
  arp -a | grep "($ip_arp_check)" | grep -v incomplete
else 
  sudo arp -d $ip_arp_check &> /dev/null
  ping -c 5 -t 2 -q $ip_arp_check &> /dev/null
  arp -a | grep "($ip_arp_check)" | grep -v incomplete &> /dev/null
fi

if [ $? -eq 0 ]; then
  echo OK
else
  echo FAIL
fi

if [ "$debug" ]; then
  echo "----------------------"
fi
