import AudioDeviceHandlerAbstract from "./AudioDeviceHandlerAbstract";
/**
 * Audio Drivers wrapper
 */
export default class AudioStripDrivers {
    static load(driver: string): AudioDeviceHandlerAbstract;
}
