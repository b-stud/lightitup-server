#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
This script is made to list all devices present in the system
It will only list a device if the maxInputChannels is greater than 0
'''
import pyaudio

pa = pyaudio.PyAudio()
suitable_devices = []
for x in xrange(0,pa.get_device_count()):
   data = pa.get_device_info_by_index(x)
   if data['maxInputChannels'] > 0:
      suitable_devices.append(data)
print ''
print '===================Devices======================'
if len(suitable_devices) == 0:
  print "No suitable device found"
else:
  for i in range(len(suitable_devices)):
     device = suitable_devices[i]
     print "===> Device index: "+str(device['index'])+",   Device name: "+device["name"]+",    Latency: "+str(device['defaultHighInputLatency'])
print ''
