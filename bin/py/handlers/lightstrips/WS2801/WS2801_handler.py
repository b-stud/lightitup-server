#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
This script allows controlling a WS2801 light strip connected to the Raspberry device
It listens to the STDIN stream and expect an array of values to apply [R, G, B, R, G, B ....]
Note 1: You MUST enable SPI communication in your Raspberry, for example by executing the 'raspi-config' utility
Note 2: You can easily adapted to any other light strip
'''

from __future__ import division
from signal import *

import time
import RPi.GPIO as GPIO

# Import the WS2801 module.

import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI

# Import other modules

import sys
import math
import json
import atexit

# Alternatively specify a hardware SPI connection on /dev/spidev0.0:

LED_COUNT = int(sys.argv[1])
SPI_PORT = int(sys.argv[2])
SPI_DEVICE = int(sys.argv[3])
pixels = Adafruit_WS2801.WS2801Pixels(LED_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE), gpio=GPIO)

def listen():
    global pixels
    try:
        while True:
            for line in iter(sys.stdin.readline, ''):
                colors = json.loads(line)
                for j in range(LED_COUNT):
                    pixels.set_pixel(j, Adafruit_WS2801.RGB_to_color(int(colors[j][0]), int(colors[j][1]), int(colors[j][2])))
                pixels.show()
                time.sleep(0.002)
    except KeyboardInterrupt:
        pass


def test():
    global pixels
    clear()
    for j in range(LED_COUNT):
        if j % 2 == 0:
            pixels.set_pixel(j, Adafruit_WS2801.RGB_to_color(255, 0, 0))
        else:
            pixels.set_pixel(j, Adafruit_WS2801.RGB_to_color(0, 0, 255))
    pixels.show()
    time.sleep(10)


@atexit.register
def cleanup():
    clear()


def clear():
    global pixels
    pixels.clear()
    pixels.show()


if __name__ == '__main__':
    for sig in (SIGABRT, SIGINT, SIGTERM):
        signal(sig, clear)
    try:
        clear()
        listen()
    except:
        pass
