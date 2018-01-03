#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
Audio output device rms analyzer
Given a device index, listen to current playing audio and return its rms value (JSON packed)
The value returned is between 0 & 1 and depend on the max & min levels detected along the time
Please note if you wish to use a bluetooth speaker, you have to enable bluetooth (for example from raspi-config utility)
Low pass filter handling inspired by James H, https://stackoverflow.com/q/27703404
'''
from ctypes import *
from contextlib import contextmanager
import pyaudio  # from http://people.csail.mit.edu/hubert/pyaudio/
import audioop
import sys
import math
import json
import os
import time
import scipy.signal
import struct
import numpy as np

DEVICE_INDEX = int(sys.argv[1])  # The audio device interface index, run the 'listDevices.py' script to list devices
LATENCY = int(sys.argv[2])  # As a speaker could be wireless, we handle a possible latency (in miliseconds)
REFRESH_DELAY = 20  # frequency with which sampling the audio signal (in miliseconds)
BUFFER = [] # Used to store samples regarding to the latency and sending them back at the right moment
MIN_SAMPLES = 200  # Count of samples to wait for before doing anything
CHANNELS = 1
CHUNK = 2048  # > 1024 # Audio frame sampling size
MOVING_MIN_MAX_TIME_WINDOW = 20000 #How many ms track track min & max
moving_min_max = [] # Save all samples for MOVING_MIN_MAX_TIME_WINDOW ms
moving_min_max_max_length = math.floor(MOVING_MIN_MAX_TIME_WINDOW / REFRESH_DELAY)
p = None # pyaudio Manager
stream = None # pyaudio Stream
ERROR_HANDLER_FUNC = CFUNCTYPE(None,c_char_p,c_int,c_char_p,c_int,c_char_p) # Prevent throwing unhandled errors
SAMPLING_RATE = 48000
sampling_rates = [48000, 44100, 32000, 22050, 14500, 11025, 10000, 8000, 5000, 3600]
MIN_RMS = 0.02 # Sound is considered as a silent if RMS is lesser then this value
FILTER_ORDER = 3 # Band Pass Filter order (attenuation shape)
FILTER_LOW_CUT_FREQUENCY = max(1, int(sys.argv[3])) # Band Pass Filter Low Frequency Limit
FILTER_HIGH_CUT_FREQUENCY = max(int(sys.argv[4]), FILTER_LOW_CUT_FREQUENCY + 1) # Band Pass Filter High Frequency Limit

def py_error_handler(filename,line,function,err,fmt):
    pass

c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)

@contextmanager
def noalsaerr():
    asound = cdll.LoadLibrary('libasound.so')
    asound.snd_lib_error_set_handler(c_error_handler)
    yield None
    asound.snd_lib_error_set_handler(None)

# Map a value from [input_min, input_max] to [output_min, output_max]
def mapped_value(
    value,
    input_min,
    input_max,
    output_min,
    output_max,
    ):
    if value < input_min:
        return 0
    if input_min == input_max:
        if value != 0 and input_min == 0:
            return 1
        elif value != 0 and input_min != 0:
            return 1 if value > input_min else 0
        else: # both value and min max are 0
            return 0
    else:
        return output_min + (output_max - output_min) * ((value
            - input_min) / (input_max - input_min))

# Exit script by displaying before a JSON error
def exit_with_error(error):
    global stream
    global p
    if stream is not None:
        stream.close()
    if p is not None:
        p.terminate()
    data = {}
    data['error'] = error
    print json.dumps(data)
    sys.exit(0)

def normalize(block):
    count = len(block)/2
    format = "%dh"%(count)
    shorts = struct.unpack( format, np.array(block) )
    doubles = [x * (1.0/32768.0) for x in shorts]
    return doubles

def get_rms(doubles):
    sum_squares = 0.0
    for sample in doubles:
        sum_squares += (sample*sample)
    return math.sqrt( sum_squares / len(doubles) )

def band_pass_filter(lowcut, highcut, fs, order = 3):
    nyq = 0.5*fs
    low = lowcut/nyq
    high = highcut/nyq
    b,a = scipy.signal.butter(order, [low,high], btype='band')
    return b,a

# Audio signal analysis loop
def rms_analyze():
    global DEVICE_INDEX
    global LATENCY
    global REFRESH_DELAY
    global BUFFER
    global MIN_SAMPLES
    global MIN
    global MAX
    global stream
    global p
    global CHANNELS
    global CHUNK
    global SAMPLING_RATE
    global MIN_RMS
    global FILTER_LOW_CUT_FREQUENCY
    global FILTER_HIGH_CUT_FREQUENCY
    global FILTER_ORDER

    selectedIndex = -1
    sampling_rate = SAMPLING_RATE

    with noalsaerr(): # Check if device is available and finding sample rate

        pa = pyaudio.PyAudio()

        for x in xrange(0, pa.get_device_count()):
            devinfo = pa.get_device_info_by_index(x)
            if ((DEVICE_INDEX != - 1 and int(devinfo['index']) == DEVICE_INDEX) or (DEVICE_INDEX == -1 and devinfo['name'] == 'default')) and devinfo['maxInputChannels'] > 0:
                selectedIndex = int(devinfo['index'])
                for f in sampling_rates:
                    try:
                        if pa.is_format_supported(f,input_device=selectedIndex,input_channels=devinfo['maxInputChannels'],input_format=pyaudio.paInt16):
                            sampling_rate = f
                            break
                    except:
                        pass
                break
        if selectedIndex == -1:
            if DEVICE_INDEX == -1:
                exit_with_error("No audio device was found")
            else:
                exit_with_error("The device associated to index '" + str(DEVICE_INDEX) + "'  does not exist")
    try:
        p = pyaudio.PyAudio()
        stream = p.open(
            format=pyaudio.paInt16,
            channels=CHANNELS,
            rate=sampling_rate,
            input=True,
            frames_per_buffer=CHUNK,
            input_device_index=selectedIndex,
            )
    except:
        exit_with_error('An error occurred while connecting to the specified audio device (index = '+str(DEVICE_INDEX)+')')

    try:
        b,a = band_pass_filter(FILTER_LOW_CUT_FREQUENCY, FILTER_HIGH_CUT_FREQUENCY, sampling_rate, FILTER_ORDER)
        while True:
            data = stream.read(CHUNK)
            filter_rms = get_rms(scipy.signal.lfilter(b, a, normalize(data), -1))
            rms = 0 if filter_rms < MIN_RMS else math.pow(filter_rms, 2)  # To increase differences between levels
            moving_min_max.append(rms)
            MIN = min(moving_min_max)
            MAX = max(moving_min_max)
            if len(moving_min_max) > moving_min_max_max_length:
                moving_min_max.pop(0)
            relativeLevel = mapped_value(rms, MIN, MAX, 0, 1)
            if len(BUFFER) * REFRESH_DELAY > LATENCY:
                val = BUFFER.pop(0)
                data = {}
                data['value'] = 0 if math.isnan(val) else val
                print json.dumps(data)
                time.sleep(REFRESH_DELAY / 1000)
            BUFFER.append(relativeLevel)
    except KeyboardInterrupt:
        exit_with_error("Keyboard Interrupt")

# Main
if __name__ == '__main__':
    try:
        rms_analyze()
    except:
        sys.exit(0)