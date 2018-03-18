/**
 * Server entry point
 * This file handles requests to append effect, clear the light strip
 * It implements a stack that allow to auto switch between effects regarding their priority & time limits
 * Should be called with `node dist/index.ts <http-port> <handle-audio> <audio-device-index> <audio-device-latency>` after having compiled with typescript
 */
import Stack from './stack/Stack';
import NetworkForwarder from './utils/NetworkForwarder';
import EffectsUtils from './utils/EffectsUtils';
import AudioDrivers from './handlers/audio/AudioDrivers';
import LightStripDrivers from "./handlers/lightstrips/LightStripDrivers";
import ControlInterfaceServer from './ControlInterface/ControlInterfaceServer';
import * as LIU_Engine from '@b-stud/lightitup-engine/src/LightItUpEngineCore';


/****************************************Requirements*************************************/
const fs = require('fs');
const path = require('path');
const thisPath = path.resolve(__dirname, '.');

const http = require('http');
const https = require('https');
const credentials = {
    key: fs.readFileSync(thisPath + '/../certificates/server.key', 'utf8'),
    cert: fs.readFileSync(thisPath +'/../certificates/server.crt', 'utf8')
};
const express = require("express");
const bodyParser = require('body-parser');

const YAML = require('yamljs');
const config = YAML.load(path.resolve(__dirname, '../default-config.yml'));
const LIGHT_STRIP_DRIVER = config.LEDS_DRIVER || 'WS2801_Python_Driver'; // Which light strip handler to use
const LEDS_COUNT = (undefined != config.LEDS_COUNT) ? config.LEDS_COUNT : 150;  //Count of LEDS
const LEDS_REFRESH_TIME = config.LEDS_REFRESH_TIME || 40;   //Update frequency
const AUDIO_DRIVER = config.AUDIO.DRIVER || 'Python_Audio_Driver'; // Which audio driver to use
const DEFAULT_PORT = config.SERVER_PORT || 8000;  //HTTP Default Server Port
const DEFAULT_PORT_SECURE = config.SERVER_PORT_SECURE || 8443;  //HTTP Default Server Port

const rgbRawOrder = config.SPI.RGB_ORDER.toUpperCase() || 'RGB';
const rgbOrder = [rgbRawOrder.indexOf('R'), rgbRawOrder.indexOf('G'), rgbRawOrder.indexOf('B') ];

const program = require('commander');
program
    .version('0.1.0')
    .option('-p, --port <n>', 'HTTP port', parseInt)
    .option('-u, --unsecured', 'Only HTTP server')
    .option('-t, --secured', 'Only HTTPS server')
    .option('-s, --secured-port <n>', 'HTTPS port', parseInt)
    .option('-n, --no-audio', 'Don\'t handle audio signal')
    .option('-d, --device <n>', 'Audio interface #index', parseInt)
    .option('-l, --latency <n>', 'Audio device latency (ms) (e.g. in case of wireless speakers)', parseInt)
    .parse(process.argv);
const usedPort = !isNaN(program.port) ? program.port : DEFAULT_PORT;
const usedPort_secure = !isNaN(program.securePort) ? program.securePort : DEFAULT_PORT_SECURE;
const handleAudio = program.audio;
const audioDevice = (handleAudio && !isNaN(program.device)) ? program.device : ((undefined != config.AUDIO.INTERFACE_INDEX) ? config.AUDIO.INTERFACE_INDEX : -1);
const audioDeviceLatency = !isNaN(program.latency) ? program.latency : config.AUDIO.LATENCY; //Default audio device latency, mostly for bluetooth devices
const lightStripHandler = LightStripDrivers.load(LIGHT_STRIP_DRIVER);
const forwarder = new NetworkForwarder(config.SYNCHRONIZED_DEVICES_HOSTS); // Which hosts to forward requests to


/****************************************Audio signal management*************************************/
let audioHandler = null;
const createAudioShell = (frequencyBand: string) => {
    destroyAudioShell();
    if (handleAudio && !audioHandler) {
        audioHandler = AudioDrivers.load(AUDIO_DRIVER);
        audioHandler.startListening(audioDevice, audioDeviceLatency, {
            frequencyBand:
                (!frequencyBand) ? [0, 20000] : (frequencyBand.split(':')).map((e) => parseInt(e))
        }, (message) => {
            if (message.hasOwnProperty("error")) {
                console.error("Error: %s", message.error);
                console.error("Server will now exit");
                gracefullyExit();
            }
            else if (message.hasOwnProperty("value")) {
                try {
                    handleAudioRms(parseFloat(message.value));
                }
                catch (e) {
                    console.error("Error: %s", e);
                }
            }
        });
    }
};
const destroyAudioShell = () => {
    if (handleAudio && audioHandler) {
        audioHandler.stopListening();
        audioHandler = null;
    }
};
const handleAudioRms = (value) => {
    LIU_Engine.AudioEffect.current_rms_value = value;
};


/****************************************Initialization*************************************/
lightStripHandler.init(LEDS_COUNT,{
    SPI: Object.assign({}, config.SPI)
}).open();
const MAX_STACK_SIZE = 20;
const stack = new Stack(MAX_STACK_SIZE);
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(function (err, req, res, next) {
    if (err) console.error(err.stack);
    res.status(500).send('Something broke!');
});
let server = null;
let secure_server = null;
let loopTimer = null; //Externalize to stop it where no effect is set
let enforcedStartTime = new Date().getTime(); //To allow effects resuming in case they have been interrupted by a greater priority effect


/*
* Firing up the Interface Server
*/
ControlInterfaceServer.init(app);


/**
 * Exit the script
 * - Switch off all the LEDs
 * - Stopping HTTP server
 */
const gracefullyExit = () => {
    console.error('Gracefully exit');
    forwarder.reset();
    setTimeout(() => {
        lightStripHandler.close();
        ControlInterfaceServer.close();
        process.exit(0);
    }, 2000);
};


/**
 * Save an effect configuration to the backup file
 * @param {JSON} data The effect configuration
 */
const saveLastEffect = (data: any): void => {
    ControlInterfaceServer.setLastEffect(data);
};


process.on('uncaughtException', (err) => {
    console.error('Caught exception: %s', err.stack);
    gracefullyExit();
});


/**
 * Handle Script exit
 */
['exit', 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'].forEach((event) => {
    process.on(<any>event, function () {
        gracefullyExit();
    });
});

/**
 * Launch a forever loop that will update all LIU_Engine.LEDs at each iteration
 */
const createLoop = () => {
    if (null != loopTimer) return;
    let first = true;
    loopTimer = setInterval(() => {
        LIU_Engine.LEDAnimator.processLEDs((leds: Array<LIU_Engine.LED>) => {
            let colors = [];
            for (let j = 0; j < leds.length; j++) {
                let color = leds[j].color;
                colors[j] = [];
                colors[j][rgbOrder[0]] = color.R;
                colors[j][rgbOrder[1]] = color.G;
                colors[j][rgbOrder[2]] = color.B;
            }
            lightStripHandler.update(colors);
        }, first, enforcedStartTime);
        first = false;
    }, LEDS_REFRESH_TIME);
};


/**
 * Stopping the forever loop
 */
const stopLoop = () => {
    if (loopTimer) clearInterval(loopTimer);
    loopTimer = null;
    destroyAudioShell();
};


/**
 * Appending an effect to the stack
 * @param config   The effect configuration array, eg:
 *                 [{
 *                     "name": "simple-color",
 *                     "options": {
 *                         "activated": true,
 *                         "delay": 0 ,
 *                         "duration": 3000,
 *                         "waitAtEnd": 0,
 *                         "repeat": "",
 *                         "color": [50,0,0]
 *                     }
 *                 }]
 * @param {number} timeLimit  default NaN, If set, the effect will auto stop after this value, else it will run forever
 * @param {number} priority   default 0,   If set, it will place the effect in the stack depending on its priority
 *                                         The effect with highest priority is set to current and will run until it ends
 */
const handleEffect = (config: any, timeLimit: number | null, priority: number | null) => {
    createLoop();
    let time = new Date().getTime();
    let id = time + "__" + Math.floor(Math.random() * 100000000); //Generates an ID
    /*
    Now with the 'unstack' feature, we want to be able to restore a previous effect
    event if the current one was expected to run forever, so we must not reset the stack anymore
    if(null == stack.getLast() || stack.getLast().priority <= priority) {
        if (isNaN(timeLimit)) { //Overrides all previous effects, will run forever (until a new effect is stacked)
            stack.reset();
        }
    }
    */
    if (!timeLimit) { // If we don't do this, the effect would never run
        timeLimit = null;
    }
    let parsedConfig = [];
    let hasAudioEffect = false;
    config.forEach((currentConfig) => {
        if (currentConfig.name == "audio") {
            hasAudioEffect = true;
            createAudioShell(currentConfig.options['frequency-band']);
        }
        parsedConfig.push(new LIU_Engine.EffectConfig(currentConfig.name, currentConfig.options));
    });
    let lastEffect = stack.push(id, parsedConfig, priority, time);
    enforcedStartTime = lastEffect.startedTime;
    LIU_Engine.LEDAnimator.setEffects(lastEffect.object, true);
    if (null !== timeLimit) {
        setTimeout(() => {
            if (hasAudioEffect) destroyAudioShell();
            let wasLast = stack.isLast(id);
            stack.remove(id);
            if (null != stack.getLast() && wasLast) {
                let restoredEffect = stack.getLast();
                enforcedStartTime = restoredEffect.startedTime;
                LIU_Engine.LEDAnimator.setEffects(restoredEffect.object);
            }
            else if (null == stack.getLast()) {
                lightStripHandler.clear();
                stopLoop();
            }
        }, timeLimit);
    }
    //Write a backup to restore it the next time the script will be launched
    saveLastEffect({config: config, timeLimit: timeLimit, priority: priority});
};


/*************************************************EFFECTS MANAGER LAUNCHING********************************************/
LIU_Engine.LEDController.createAll(LEDS_COUNT);
lightStripHandler.clear(); //Make all leds switched off

if(config.PLAY_LAST_EFFECT_ON_STARTUP) {
    // Trying to restore last effect if it has been saved
    const restored = (ControlInterfaceServer.getLastEffect());
    if (null !== restored) {
        handleEffect(restored.config, restored.timeLimit, restored.priority);
        forwarder.stack(restored.config, restored.timeLimit, restored.priority);
    }
}


/************************************************HTTP REQUESTS HANDLER*************************************************/
const reset = () => {
    stopLoop();
    stack.reset();
    lightStripHandler.clear();
};

const toggle = () => {
    if(stack.getLast()) {
        reset();
    } else {
        const restored = (ControlInterfaceServer.getLastEffect());
        if (null !== restored) {
            handleEffect(restored.config, restored.timeLimit, restored.priority);
        }
    }
};

/*
* Check if device server is online
*/
app.get('/ping', function (req, res) {
    res.send('online');
});


/*
* Reset the stack effect & switch off all LEDs
*/
app.post('/reset', function (req, res) {
    if(req.body.apply_to_slaves) {
        forwarder.reset();
    }
    reset();
    res.send('Reset done');
});


/*
* Toggle state (ON/OFF)
*/
app.post('/toggle', function (req, res) {
    if(req.body.apply_to_slaves) {
        forwarder.toggle();
    }
    toggle();
    res.send('Toggle done');
});


/*
* Appending a new effects set to the stack or ignoring it depending on its priority
*
* The request must contain a JSON body as the following:
* {
*   "config":    Array<EffectConfig>,
* 	"timeLimit": integer (ms)|null,  <optional>   //If not null, effect will be stopped after this time value
* 	"priority":  integer|null       <optional> , //If not null, the effect will be positioned in the stack depending on its priority, the greatest priority wins
*                                                 //Note: The effect that "losts" is not removed, it will resume after the new one is finished (if the new one it's a finite time effect).
* }
*/
app.post('/stack', function (req, res) {
    let err = null;
    try {
        let config = req.body.config;
        let timeLimit = req.body.timeLimit || EffectsUtils.evaluateEffectDuration(config);
        let priority = req.body.priority || 0;
        handleEffect(config, timeLimit, priority);
        if(req.body.apply_to_slaves) {
            forwarder.stack(config, timeLimit, priority);
        }
    }
    catch (e) {
        err = e;
        console.error(e);
    }
    finally {
        res.send(err || 'sent');
    }
});

/**
* Unstack the effect currently being played (top of the stack)
* The request can contain a JSON body as the following:
* {
*   "priority_min":    integer, <optional> If set, the effect currently being played will be unstacked only if it has a priority greater than or equal the value specified
*   "priority_max":    integer, <optional> If set, the effect currently being played will be unstacked only if it has a priority lesser than or equal the value specified
* }
 */
app.post('/unstack', function (req, res) {
    let err = null;
    try {
        let currentEffect = stack.getLast();
        const minPriority = req.body.priority_min?parseInt(req.body.priority_min):null;
        const maxPriority = req.body.priority_max?parseInt(req.body.priority_max):null;
        const currentPriority = currentEffect.priority;

        if(req.body.apply_to_slaves) {
            forwarder.unstack(minPriority, maxPriority);
        }

        if((minPriority === null || currentPriority >= minPriority) && (maxPriority === null || currentPriority <= maxPriority)) {
            destroyAudioShell();
            stack.remove(currentEffect.id);
            let restoredEffect = stack.getLast();
            if (null != restoredEffect) {
                enforcedStartTime = restoredEffect.startedTime;
                LIU_Engine.LEDAnimator.setEffects(restoredEffect.object);
            }
            else if (null == stack.getLast()) {
                lightStripHandler.clear();
                stopLoop();
            }
        }
    }
    catch (e) {
        err = e;
        console.error(e);
    }
    finally {
        res.send(err || 'done');
    }
});

const showServerStartedMessage = (address, port, secure) => {
    const protocol = secure ? 'https' : 'http';
    console.error("The server is online, you can start to send requests at : %s://%s:%s", protocol, address, port);
};

secure_server = https.createServer(credentials, app);
server = http.createServer(app);

if (!program.unsecured && config.HTTPS_SERVER) {
    secure_server.listen(usedPort_secure, function () {
        let host = secure_server.address().address;
        let port = secure_server.address().port;
        showServerStartedMessage('<server-address>', usedPort_secure, true);
    });
}

if (!program.secured && config.HTTP_SERVER) {
    server.listen(usedPort, function () {
        let host = server.address().address;
        let port = server.address().port;
        showServerStartedMessage('<server-address>', usedPort, false);
    });
}

/**
 * Expose some methods to other modules
 */
export default class IndexAPI {
    static reset() {
        reset();
    }
    static propagateStack(config, timeLimit, priority) {
        forwarder.stack(config, timeLimit, priority);
    }
    static propagateReset() {
        forwarder.reset();
    }

    static handleEffect(config, timeLimit, priority) {
        if (!config) {
            reset();
        } else {
            handleEffect(config, timeLimit, priority);
        }
    }
}