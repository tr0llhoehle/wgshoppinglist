#!/bin/sh

#Move to the folder where wgshoppinglist is installed
cd `dirname $0`

#Was this script started in the bin folder? if yes move out
if [ -d "../bin" ]; then
  cd "../"
fi

#Stop the script if its started as root
if [ "$(id -u)" -eq 0 ]; then
   echo "You shouldn't start WG Shopping List as root!"
   echo "Please type 'WG Shopping List rocks my socks' if you still want to start it as root"
   read rocks
   if [ ! $rocks = "WG Shopping List rocks my socks" ]
   then
     echo "Your input was incorrect"
     exit 1
   fi
fi

#start
echo "start..."
node wgshoppinglist.js $*