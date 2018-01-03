#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
This script allows controlling a LPD8806 based light strip connected to the Raspberry device
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
sys.path.append('.')


# Import the LPD8806 module.
import LPD8806

LED_COUNT = int(sys.argv[1])
SPI_PORT = int(sys.argv[2])
SPI_DEVICE = int(sys.argv[3])
strip = LPD8806.strand(LED_COUNT, '/dev/spidev' + str(SPI_PORT) + '.' + str(SPI_DEVICE))

def listen():
    global strip
    try:
        while True:
            for line in iter(sys.stdin.readline, ''):
                colors = json.loads(line)
                for j in range(LED_COUNT):
                    strip.set(j, int(colors[j][0]), int(colors[j][2]), int(colors[j][1]))
                strip.update()
                time.sleep(0.002)
    except KeyboardInterrupt:
        pass


@atexit.register
def clear():
    global strip
    strip.fill(0, 0, 0)
    strip.update()

if __name__ == '__main__':
    for sig in (SIGABRT, SIGINT, SIGTERM):
        signal(sig, clear)
    try:
        clear()
        listen()
    except:
        pass
