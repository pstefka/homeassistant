#!/bin/bash
#5050
#8888
for i in `seq 1 100`; do
  nc -vvn 192.168.1.6 5050 #2> /dev/null
done

