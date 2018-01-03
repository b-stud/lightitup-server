import LightStripHandlerAbstract from "./LightStripHandlerAbstract";
import WS2801Handler from "../lightstrips/WS2801/python/WS2801Handler";
import WS281XHandler from "./WS281X/python/WS281XHandler";
import WS2811_400Handler from "./WS281X/python/WS2811_400Handler";
import APA102_DotStarHandler from "./APA102-DotStar/python/APA102-DotStarHandler";
import LPD8806Handler from "./LPD8806/python/LPD8806Handler";
import P9813Handler from "./P9813/python/P9813Handler";

/**
 * Light strips Drivers wrapper
 */
export default class LightStripDrivers {

    public static load(driver: string): LightStripHandlerAbstract {
        switch (driver) {
            case WS2801Handler.driver_name:
                return new WS2801Handler();
            case WS281XHandler.driver_name:
                return new WS281XHandler();
            case WS2811_400Handler.driver_name:
                return new WS2811_400Handler();
            case APA102_DotStarHandler.driver_name:
                return new APA102_DotStarHandler();
            case LPD8806Handler.driver_name:
                return new LPD8806Handler();
            case P9813Handler.driver_name:
                return new P9813Handler();
        }
    }

}