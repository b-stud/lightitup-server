#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
This script allows controlling a P9813 light strip connected to the Raspberry device
It listens to the STDIN stream and expect an array of values to apply [R, G, B, R, G, B ....]
Note 1: You MUST enable SPI communication in your Raspberry, for example by executing the 'raspi-config' utility
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
import sys


# Import the P9813 module.
import RPi.GPIO as GPIO
import P9813

# LED strip configuration:
LED_COUNT = int(sys.argv[1])
CLOCK_PIN = int(sys.argv[4])
DATA_PIN = int(sys.argv[5])

# Init GPI Pins
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(CLOCK_PIN, GPIO.OUT)
GPIO.setup(DATA_PIN, GPIO.OUT)

strip = P9813.P9813(CLOCK_PIN, DATA_PIN, LED_COUNT)

def listen():
    global strip
    try:
        while True:
            for line in iter(sys.stdin.readline, ''):
                colors = json.loads(line)
                for j in range(LED_COUNT):
                    strip[j] = (int(colors[j][0]), int(colors[j][2]), int(colors[j][1]))
                strip.write()
                time.sleep(0.002)
    except KeyboardInterrupt:
        pass


@atexit.register
def clear():
    global strip
    strip.fill((255,0,0))
    strip.write()

if __name__ == '__main__':
    for sig in (SIGABRT, SIGINT, SIGTERM):
        signal(sig, clear)
    try:
        clear()
        listen()
    except:
        pass
