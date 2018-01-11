"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Server entry point
 * This file handles requests to append effect, clear the light strip
 * It implements a stack that allow to auto switch between effects regarding their priority & time limits
 * Should be called with `node dist/index.ts <http-port> <handle-audio> <audio-device-index> <audio-device-latency>` after having compiled with typescript
 */
var Stack_1 = require("./stack/Stack");
var EffectsUtils_1 = require("./utils/EffectsUtils");
var AudioDrivers_1 = require("./handlers/audio/AudioDrivers");
var LightStripDrivers_1 = require("./handlers/lightstrips/LightStripDrivers");
var ControlInterfaceServer_1 = require("./ControlInterface/ControlInterfaceServer");
var LIU_Engine = require("@b-stud/lightitup-engine/src/LightItUpEngineCore");
/****************************************Requirements*************************************/
var fs = require('fs');
var path = require('path');
var thisPath = path.resolve(__dirname, '.');
var http = require('http');
var https = require('https');
var credentials = {
    key: fs.readFileSync(thisPath + '/../certificates/server.key', 'utf8'),
    cert: fs.readFileSync(thisPath + '/../certificates/server.crt', 'utf8')
};
var express = require("express");
var bodyParser = require('body-parser');
var YAML = require('yamljs');
var config = YAML.load(path.resolve(__dirname, '../default-config.yml'));
var LIGHT_STRIP_DRIVER = config.LEDS_DRIVER || 'WS2801_Python_Driver'; // Which light strip handler to use
var LEDS_COUNT = (undefined != config.LEDS_COUNT) ? config.LEDS_COUNT : 150; //Count of LEDS
var LEDS_REFRESH_TIME = config.LEDS_REFRESH_TIME || 40; //Update frequency
var AUDIO_DRIVER = config.AUDIO.DRIVER || 'Python_Audio_Driver'; // Which audio driver to use
var DEFAULT_PORT = config.SERVER_PORT || 8000; //HTTP Default Server Port
var DEFAULT_PORT_SECURE = config.SERVER_PORT_SECURE || 8443; //HTTP Default Server Port
var rgbRawOrder = config.SPI.RGB_ORDER.toUpperCase() || 'RGB';
var rgbOrder = [rgbRawOrder.indexOf('R'), rgbRawOrder.indexOf('G'), rgbRawOrder.indexOf('B')];
var program = require('commander');
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
var usedPort = !isNaN(program.port) ? program.port : DEFAULT_PORT;
var usedPort_secure = !isNaN(program.securePort) ? program.securePort : DEFAULT_PORT_SECURE;
var handleAudio = program.audio;
var audioDevice = (handleAudio && !isNaN(program.device)) ? program.device : ((undefined != config.AUDIO.INTERFACE_INDEX) ? config.AUDIO.INTERFACE_INDEX : -1);
var audioDeviceLatency = !isNaN(program.latency) ? program.latency : config.AUDIO.LATENCY; //Default audio device latency, mostly for bluetooth devices
var lightStripHandler = LightStripDrivers_1.default.load(LIGHT_STRIP_DRIVER);
/****************************************Audio signal management*************************************/
var audioHandler = null;
var createAudioShell = function (frequencyBand) {
    destroyAudioShell();
    if (handleAudio && !audioHandler) {
        audioHandler = AudioDrivers_1.default.load(AUDIO_DRIVER);
        audioHandler.startListening(audioDevice, audioDeviceLatency, {
            frequencyBand: (!frequencyBand) ? [0, 20000] : (frequencyBand.split(':')).map(function (e) { return parseInt(e); })
        }, function (message) {
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
var destroyAudioShell = function () {
    if (handleAudio && audioHandler) {
        audioHandler.stopListening();
        audioHandler = null;
    }
};
var handleAudioRms = function (value) {
    LIU_Engine.AudioEffect.current_rms_value = value;
};
/****************************************Initialization*************************************/
lightStripHandler.init(LEDS_COUNT, {
    SPI: Object.assign({}, config.SPI)
}).open();
var stack = new Stack_1.default();
var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function (err, req, res, next) {
    if (err)
        console.error(err.stack);
    res.status(500).send('Something broke!');
});
var server = null;
var secure_server = null;
var loopTimer = null; //Externalize to stop it where no effect is set
var enforcedStartTime = new Date().getTime(); //To allow effects resuming in case they have been interrupted by a greater priority effect
/*
* Firing up the Interface Server
*/
ControlInterfaceServer_1.default.init(app);
/**
 * Exit the script
 * - Switch off all the LEDs
 * - Stopping HTTP server
 */
var gracefullyExit = function () {
    console.error('Gracefully exit');
    lightStripHandler.close();
    ControlInterfaceServer_1.default.close();
    process.exit(0);
};
/**
 * Save an effect configuration to the backup file
 * @param {JSON} data The effect configuration
 */
var saveLastEffect = function (data) {
    ControlInterfaceServer_1.default.setLastEffect(data);
};
process.on('uncaughtException', function (err) {
    console.error('Caught exception: %s', err.stack);
    gracefullyExit();
});
/**
 * Handle Script exit
 */
['exit', 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'].forEach(function (event) {
    process.on(event, function () {
        gracefullyExit();
    });
});
/**
 * Launch a forever loop that will update all LIU_Engine.LEDs at each iteration
 */
var createLoop = function () {
    if (null != loopTimer)
        return;
    var first = true;
    loopTimer = setInterval(function () {
        LIU_Engine.LEDAnimator.processLEDs(function (leds) {
            var colors = [];
            for (var j = 0; j < leds.length; j++) {
                var color = leds[j].color;
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
var stopLoop = function () {
    if (loopTimer)
        clearInterval(loopTimer);
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
var handleEffect = function (config, timeLimit, priority) {
    createLoop();
    var time = new Date().getTime();
    var id = time + "__" + Math.floor(Math.random() * 100000000); //Generates an ID
    if (isNaN(timeLimit)) {
        stack.reset();
    }
    if (!timeLimit) {
        timeLimit = null;
    }
    var parsedConfig = [];
    var hasAudioEffect = false;
    config.forEach(function (currentConfig) {
        if (currentConfig.name == "audio") {
            hasAudioEffect = true;
            createAudioShell(currentConfig.options['frequency-band']);
        }
        parsedConfig.push(new LIU_Engine.EffectConfig(currentConfig.name, currentConfig.options));
    });
    var lastEffect = stack.push(id, parsedConfig, priority, time);
    enforcedStartTime = lastEffect.startedTime;
    LIU_Engine.LEDAnimator.setEffects(lastEffect.object, true);
    if (null !== timeLimit) {
        setTimeout(function () {
            if (hasAudioEffect)
                destroyAudioShell();
            var wasLast = stack.isLast(id);
            stack.remove(id);
            if (null != stack.getLast() && wasLast) {
                var restoredEffect = stack.getLast();
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
    saveLastEffect({ config: config, timeLimit: timeLimit, priority: priority });
};
/*************************************************EFFECTS MANAGER LAUNCHING********************************************/
LIU_Engine.LEDController.createAll(LEDS_COUNT);
lightStripHandler.clear(); //Make all leds switched off
if (config.PLAY_LAST_EFFECT_ON_STARTUP) {
    // Trying to restore last effect if it has been saved
    var restored = (ControlInterfaceServer_1.default.getLastEffect());
    if (null !== restored) {
        handleEffect(restored.config, restored.timeLimit, restored.priority);
    }
}
/************************************************HTTP REQUESTS HANDLER*************************************************/
var reset = function () {
    stopLoop();
    stack.reset();
    lightStripHandler.clear();
};
var toggle = function () {
    if (stack.getLast()) {
        stack.reset();
        lightStripHandler.clear();
    }
    else {
        var restored = (ControlInterfaceServer_1.default.getLastEffect());
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
    reset();
    res.send('Reset done');
});
/*
* Reset the stack effect & switch off all LEDs
*/
app.post('/toggle', function (req, res) {
    toggle();
    res.send('Toggle done');
});
/*
* Appending a new effects set to the stack or ignoring it depending on its priority
*
* The request must contain a JSON body as follow:
* {
*   "config":    Array<EffectConfig>,
* 	"timeLimit": integer (ms)|null,  <optional>   //If not null, effect will be stopped after this time value
* 	"priority":  integer|null       <optional> , //If not null, the effect will be positioned in the stack depending on its priority, the greatest priority wins
*                                                 //Note: The effect that "losts" is not removed, it will resume after the new one is finished (if the new one it's a finite time effect).
* }
*/
app.post('/stack', function (req, res) {
    var err = null;
    try {
        var config_1 = req.body.config;
        var timeLimit = req.body.timeLimit || EffectsUtils_1.default.evaluateEffectDuration(config_1);
        var priority = req.body.priority || 0;
        handleEffect(config_1, timeLimit, priority);
    }
    catch (e) {
        err = e;
        console.error(e);
    }
    finally {
        res.send(err || 'sent');
    }
});
var showServerStartedMessage = function (address, port, secure) {
    var protocol = secure ? 'https' : 'http';
    console.error("The server is online, you can start to send requests at : %s://%s:%s", protocol, address, port);
};
secure_server = https.createServer(credentials, app);
server = http.createServer(app);
if (!program.unsecured && config.HTTPS_SERVER) {
    secure_server.listen(usedPort_secure, function () {
        var host = secure_server.address().address;
        var port = secure_server.address().port;
        showServerStartedMessage('<server-address>', usedPort_secure, true);
    });
}
if (!program.secured && config.HTTP_SERVER) {
    server.listen(usedPort, function () {
        var host = server.address().address;
        var port = server.address().port;
        showServerStartedMessage('<server-address>', usedPort, false);
    });
}
/**
 * Expose some methods to other modules
 */
var IndexAPI = /** @class */ (function () {
    function IndexAPI() {
    }
    IndexAPI.reset = function () {
        reset();
    };
    IndexAPI.handleEffect = function (config, timeLimit, priority) {
        if (!config) {
            reset();
        }
        else {
            handleEffect(config, timeLimit, priority);
        }
    };
    return IndexAPI;
}());
exports.default = IndexAPI;
//# sourceMappingURL=index.js.map