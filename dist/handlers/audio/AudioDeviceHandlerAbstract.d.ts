/**
 * Interface to be implemented by any audio device listener
 */
export default abstract class AudioDeviceHandlerInterface {
    /**
     * Start to listen to the audio device and send back rms data to the fn callback
     * @param {number} deviceIndex  Audio device index, launch ``python bin/py/listDevices.py` to see the devices list
     * @param {number} latency In case a Bluetooth speaker is used, you may need to set a latency to sync audio & LEDs
     * @param {any} fn A callback function that will handle the rms value
     *                   Messages sent to fn, should only be JSON strings of these 2 types :
     *                           {error: 'Some error message'}
     *                           {value: x} with x a number between 0 and 1, which is an rms dynamic level
     *                                      (relative to the min and max rms values observed)
     */
    abstract startListening(deviceIndex: number, latency: number, opts: any, fn: any): any;
    /**
     * Stop listening to the audio device
     */
    abstract stopListening(): any;
}
