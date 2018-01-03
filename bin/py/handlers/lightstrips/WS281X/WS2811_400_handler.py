#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
This script allows controlling a WS281X (WS2811/WS2812 NeoPixel) light strip connected to the Raspberry device
It listens to the STDIN stream and expect an array of values to apply [R, G, B, R, G, B ....]
Note 1: You MUST enable SPI communication in your Raspberry, for example by executing the 'raspi-config' utility
Note 2: You can easily adapted to any other light strip
Note 3: A part of this file is directly included from the NeoPixel library strandtest by Tony DiCola (tony@tonydicola.com)
'''

from __future__ import division
from signal import *

# Import the WS2801 module.
from neopixel import *

# Import other modules
import time
import sys
import math
import json
import atexit

# LED strip configuration:

LED_COUNT = int(sys.argv[1])  # Number of LED pixels.
# LED_PIN = 18  # GPIO pin connected to the pixels (18 uses PWM!).
LED_PIN = 10  # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ = 400000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 5  # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False  # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0  # set to '1' for GPIOs 13, 19, 41, 45 or 53
LED_STRIP = ws.WS2811_STRIP_GRB  # Strip type and colour ordering
strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)


@atexit.register
def clear():
    global strip
    for i in range(0, LED_COUNT):
        color = Color(0, 255, 0)
        strip.setPixelColor(i, color)
    strip.show()


def listen():
    global strip
    try:
        while True:
            for line in iter(sys.stdin.readline, ''):
                colors = json.loads(line)
                for j in range(0, LED_COUNT):
                    strip.setPixelColor(j, Color(int(colors[j][0]), int(colors[j][2]), int(colors[j][1])))
                strip.show()
                time.sleep(0.002)
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    for sig in (SIGABRT, SIGINT, SIGTERM):
        signal(sig, clear)
    try:
        strip.begin()
        clear()
        listen()
    except:
        pass
