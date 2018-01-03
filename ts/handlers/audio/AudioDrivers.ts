import AudioDeviceHandlerAbstract from "./AudioDeviceHandlerAbstract";
import PythonAudioDeviceHandler from "./python/PythonAudioDeviceHandler";

/**
 * Audio Drivers wrapper
 */
export default class AudioStripDrivers {

    public static load(driver: string): AudioDeviceHandlerAbstract {
        switch (driver) {
            case PythonAudioDeviceHandler.driver_name:
                return new PythonAudioDeviceHandler();
        }
    }

}