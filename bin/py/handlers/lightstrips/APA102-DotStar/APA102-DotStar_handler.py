#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
This script allows controlling a DotStar based light strip
connected to the Raspberry device
It listens to the STDIN stream and expect an array of values
to apply [R, G, B, R, G, B ....]
Note 1: You MUST enable SPI communication in your Raspberry,
for example by executing the 'raspi-config' utility
Note 2: You can easily adapted to any other light strip
'''
from __future__ import division
from signal import *
# Import other modules
import time
import sys
import math
import json
import atexit
from dotstar import Adafruit_DotStar  # Import the DotStar module.

LED_COUNT = int(sys.argv[1])
CLOCK_PIN = int(sys.argv[4])
DATA_PIN = int(sys.argv[5])

strip = Adafruit_DotStar(LED_COUNT, DATA_PIN, CLOCK_PIN)


def listen():
    global strip
    try:
        while True:
            for line in iter(sys.stdin.readline, ''):
                colors = json.loads(line)
                for j in range(LED_COUNT):
                    strip.setPixelColor(
                        j,
                        int(colors[j][0]),
                        int(colors[j][2]),
                        int(colors[j][1])
                    )
                strip.show()
                time.sleep(0.002)
    except KeyboardInterrupt:
        pass


def test():
    global strip
    strip.clear()
    for j in range(LED_COUNT):
        if j % 2 == 0:
            strip.setPixelColor(j, 255, 0, 0)
        elif j % 3 == 0:
            strip.setPixelColor(j, 0, 255, 0)
        else:
            strip.setPixelColor(j, 0, 0, 255)
    strip.show()
    time.sleep(10)


@atexit.register
def clear():
    global strip
    strip.clear()
    strip.show()

if __name__ == '__main__':
    for sig in (SIGABRT, SIGINT, SIGTERM):
        signal(sig, clear)
    try:
        strip.begin()
        strip.setBrightness(255)
        clear()
        listen()
    except:
        pass
