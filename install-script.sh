#!/bin/sh
: <<'description'
This script setups the Light'It up server
It creates an autostart (set autostart to false to disable autostart) service which launch the server at boot
It installs all required dependencies and create required folders and files (logs, and so on..)
The server auto starts at the installation end
description

# --------- User custom configuration -------- #
autostart_service=true
# --------- End: User custom configuration -------- #


appname="lightitup"
logpath="/var/log/$appname/output.log"
errorlogpath="/var/log/$appname/error.log"
pm2path="pm2"

DIRECTORY=$(cd `dirname $0` && pwd)
echo '======================= Cleaning previous version ======================'
service $appname stop 2>/dev/null
rm -rf /opt/$appname/
rm -rf /var/log/$appname/

echo '=========================== Updating system ==========================='
yes | apt-get update
yes | apt-get upgrade

echo '=========================== Installing Git ==========================='
yes | apt-get install git-core


arm=$(uname -m)
node_installed=$(which node)
npm_installed=$(which npm)
if [ -z "$node_installed" ] || [ -z "$npm_installed" ]; then
 echo '=========================== Installing Node & NPM ==========================='
 if [ "$arm" = "armv6l" ]; then
  echo '=========================== On ARMV6l (Raspberry Pi Model Zero v1.3, Zero W, A, B, B+)==========================='
  wget https://nodejs.org/dist/latest-v9.x/node-v9.3.0-linux-armv6l.tar.gz -P /tmp/
  tar -xzf /tmp/node-v9.3.0-linux-armv6l.tar.gz -C /tmp/
  mv /tmp/node-v9.3.0-linux-armv6l /opt/nodejs
  rm /tmp/node-v9.3.0-linux-armv6l.tar.gz
  ln -s /opt/nodejs/bin/node /usr/bin/node
  ln -s /opt/nodejs/bin/npm /usr/bin/npm
  grep -q -F 'export PATH="$PATH:/opt/nodejs/bin"' ~/.profile || echo 'export PATH="$PATH:/opt/nodejs/bin"' >> ~/.profile
  source ~/.profile
  pm2path="/opt/nodejs/lib/node_modules/pm2/bin/pm2"
 else
  echo '=========================== On ARMV7l (Raspberry Pi 2B, Pi 3B)==========================='
  yes | apt-get install curl
  yes | apt-get install gnupg2
  curl -sL https://deb.nodesource.com/setup_9.x -o nodesource_setup.sh
  bash nodesource_setup.sh
  yes | apt-get install nodejs
 fi
else
 echo '=========================== Node is already installed ==========================='
fi


echo '=========================== Installing python & pip ==========================='
yes | apt-get install python python-pip python-dev

echo '=========================== Installing python required libraries ==========================='
yes | apt-get install libasound2-dev portaudio19-dev libportaudio2 libportaudiocpp0 ffmpeg libav-tools
yes | apt-get install python-setuptools
yes | apt-get install python-pyaudio
yes | apt-get install python-scipy
pip install Adafruit_WS2801
pip install Adafruit_GPIO
pip install RPi.GPIO
pip install rpi_ws281x

echo '=========================== Creating log files & directory ==========================='
mkdir /var/log/$appname/
touch /var/log/$appname/output.log
touch /var/log/$appname/error.log

echo '=========================== Moving project to final location ==========================='
mkdir /opt/$appname/
cp -r $DIRECTORY/* /opt/$appname

echo '=========================== Installing node dependencies ==========================='
cd /opt/$appname/ || exit
export LZZ_COMPAT=1
npm install --unsafe-perm

echo '=========================== Compiling project ==========================='
npm run-script build

echo '=========================== Create and launch an auto-run service [PM2] ==========================='
if [ "$autostart_service"  = true ] ; then
    npm install -g pm2 --unsafe-perm
    $pm2path unstartup
    $pm2path startup --service-name $appname
    $pm2path start /opt/$appname/dist/index.js --watch --name $appname --update-env
    $pm2path save
else
 echo "=========================== Autorun disabled, exec: node /opt/$appname/dist/index.js > $logpath 2> $errorlogpath ==========================="
fi