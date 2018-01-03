# Light'It Up Engine

[1. Introduction](#1-introduction)<br/>
[2. Compilation process](#2-compilation-process)<br/>
[3. Loading the library](#3-loading-the-library)<br/>
[4. Usage](#4-usage)<br/>
[5. Effects options](#5-effects-and-options)<br/>
[6. License](#6-license)<br/>
[7. Author](#7-author)<br/>

## 1. Introduction
__Light'It Up engine__ is a framework that allows to create and customize effects for being used on light strips, or even
on your browser.

To make the customization and preview process easy, a tool has been designed and is available at the following location [Light'It Up Configurator](http://www.bstud.com/lightitup-engine/configurator)
Moreover, you will also be able to export the current spline and import it back later using a JSON format.

*__NOTE__: This project has no direct interaction with light strips device, you will need a bridge between your device and this library to
play your light effects. For this purpose, a node server offering complex features is available here
 [Light'It Up Server](http://www.github.com/b-stud/lightitup-server)*



## 2. Compilation process
The framework is written in Typescript language and packaged with Webpack.
You can of course use the ready to use javascript distributed file, but if for any reason you need to build the framework again,
then follow these steps.

First of all you will need to install [the NodeJS Framework](https://nodejs.org/en/). Then, you will need to install
required dependencies by running the following instructions :

```bash
# Navigate to the library directory
cd lightitup-engine

# Installing dependencies
npm install
```

Then to trigger the build process :
```bash
npm run-script build
```


## 3. Loading the library

The library is packed using the "Universal Module Definition" scheme. You can then include it into various javascript contexts :

* Vanilla JS
```html
<!doctype html>
<head>...
<script type="text/javascript" src="dist/lightitup-engine.min.js"></script>
...
<body>
...
<script type="text/javascript">
// A global object LightItUpEngine is now available
const LEDsCount = 50, refreshFrequency = 50;
LightItUpEngine.LEDController.createAll(LEDsCount);
LightItUpEngine.LEDAnimator.setEffects(...);
let init = true;
setInterval(() => {
    LightItUpEngine.LEDAnimator.processLEDs((LEDs) => {
        LEDs.forEach((LED, index) => {
            // Do something with the LED color LED.color
            // For example
            myList.children[index].style.backgroundColor = LED.color.toString();
        });
    }, init);
    init = false;
}, refreshFrequency);
</script>
</body>
...
```

* Require JS
```html
<!doctype html>
<head>...
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.js"></script>
...
<script type="text/javascript">
requirejs.config({
    baseUrl: './dist',
    paths: {
        LightItUpEngine: 'lightitup-engine.min'
    }
});
require(['LightItUpEngine'], (LightItUpEngine) => {
// You then have access to LightItUpEngine object
// (See below the usage section to learn how to use it)
});
</script>
</body>
```

* Node JS module definition way
```js
const LightItUpEngine = require('LightItUpEngine');

// You then have access to LightItUpEngine object
// (See below the usage section to learn how to use it)
```



## 4. Usage

The library being loaded, you can start loading effects :

* Forever Loop

First of all, let's create the LEDs pixels :

```javascript
const LEDsCount = 100; // How many LEDs
LightItUpEngine.LEDController.createAll(LEDsCount);  // Will reset previous pixels
```


* Forever Loop

After this, we will need to create a forever loop that will update LEDs pixels at the frequency we choose :
```javascript
onst refreshFrequency = 50;
setInterval(() => {
    LightItUpEngine.LEDAnimator.processLEDs((leds) => {
        leds.forEach((led, index) => {
            // For each LED, we can now access to its computed color
            const currentLedColor = led.color;
            applyColorSomewhere(index, currentLedColor.toString());
        });
    }, init);
}, refreshFrequency);
```


* Dynamically changing the current effect

For example, let's apply an animated Rainbow effect :

```javascript
const effectToApply = LightItUpEngine.Effects.RainbowEffect._name;

// See the next section to have more information on available effects and their options
const effectOptions = {
  // Common effects options
  'activated': true,
  'delay': 0,
  'duration': 10000,
  'waitAtEnd': 0,
  'repeat': null,
  // Rainbow effect proper options
  'animated': true,
  'angleCover': 360,
  'offsetAngle': 0,
  'easing': 'linear'
};

const newEffectsConfiguration = [
    new LightItUpEngine.EffectConfig(effectToApply, effectOptions)
];

// setEffects takes an Array<EffectConfig> as argument
LightItUpEngine.LEDAnimator.setEffects(newEffectsConfiguration);
```


## 5. Effects and options

### 5.1 Available effects

In order to get the list of all available effects and their corresponding options, you can either just glance at
the file [EffectsAPI_JSON.ts](src/effects/EffectsAPI_JSON.ts) or accessing the [Light'It Up Configurator](http://www.bstud.com/lightitup-engine/configurator) with which
you will easily export your customization work (an "Export" button will compute the configuration for you).

### 5.2 Effects options

Each available effect inherits some global options and has its own customization options.
This section will only describe global options, see previous section to know how to obtain the particular options list for each given effect.

```javascript
{
  activated: true, // boolean => To specify if the effect should be processed, default to true
  delay: 0, // integer => Defines the delay the effect should be wait before being processed at each iteration, default to 0
  duration: 3000, // integer => The time (in milliseconds) the effect takes to be completed, after this time the effect is not processed until next tour
  waitAtEnd: 0 //integer => Time (in milliseconds) to wait after the effect is completed befort starting it over again (also useful for effects combination), default to 0
  repeat: null // If the set the effect will run the corresponding number of iterations and will be stopped after
}
````

#### Easing option

Some effects have an easing options which let you change the way from going from 0 to 100%.
Following values are handled :

```text
- linear (default)
- cubicBezier
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- random
```

You can also define your own easing by setting cubic Bezier points, e.g. :

```javascript
{
    // ...,
    "easing": [0.25, 0.4, 0.6, 0.8] // Corresponds to P1.x, P1.y, P2.x, P2.y
}
```

### 5.2 Effects combination

As explained above, the method `setEffects()` takes an array as unique argument.
Which means that you could send a stack of different effects at the same time, but to combine them,
you will have to set properly the duration, delay, and waitAtEnd options.

For example, let's create an effect this way :

- We'll build a 5 second rainbow followed by a 2 seconds fixed Green color

```javascript
const effectConfiguration = [
  new LightItUpEngine.EffectConfig(LightItUpEngine.Effects.RainbowEffect._name, {
      "activated": true,
      "delay": 0,
      "duration": 5000,
      "waitAtEnd": 2000, // Waiting for simple color effect to complete
      "repeat": null,
      "animated": true,
      "angleCover": 360,
      "offsetAngle": 0,
      "easing": "linear"
  }),
  new LightItUpEngine.EffectConfig(LightItUpEngine.Effects.SimpleColorEffect._name, {
    "activated": true,
    "delay": 5000,  // Waiting for rainbow color effect to complete
    "duration": 2000,
    "waitAtEnd": 0,
    "repeat": null,
    "color": [0, 255, 0]
  })
];
```

## 6. License
Please find all the license information inside the LICENSE.md file

## 7. Author
Bilel OURAL - bilel.oural@b-stud.com
