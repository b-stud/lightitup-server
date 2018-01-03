/**
 * Expose all existing options of available effects
 */
export const EffectsAPI_JSON = {
  "globalProperties": [
    {
      "id": "activated",
      "value": true,
      "title": "Activated",
      "description": "Should the the effect run",
      "type": "boolean",
      "global": true
    },
    {
      "id": "delay",
      "value": 0,
      "title": "Delay",
      "description": "Delay the animation start",
      "type": "integer",
      "min": 0,
      "step": 1,
      "global": true
    },
    {
      "id": "duration",
      "title": "Duration",
      "type": "integer",
      "value": 3000,
      "min": 1,
      "step": 1,
      "global": true
    },
    {
      "id": "waitAtEnd",
      "value": 0,
      "title": "Wait at effect end",
      "type": "integer",
      "min": 0,
      "step": 1,
      "global": true
    },
    {
      "id": "repeat",
      "value": null,
      "title": "Repeat",
      "description": "How many times run the effect",
      "type": "integer",
      "step": 1,
      "min": 1,
      "global": true
    }
  ],
  "list": [
    {
      "name": "simple-color",
      "title": "Simple Color Effect",
      "description": "Set a simple color",
      "properties": [
        {
          "id": "color",
          "title": "Color basis",
          "type": "color",
          "value": [
            0,
            83,
            251
          ]
        }
      ]
    },
    {
      "name": "random-color",
      "title": "Random Color Effect",
      "description": "Set a random color at each step",
      "properties": [
        {
          "id": "bright",
          "title": "Bright colors only",
          "type": "boolean",
          "value": true
        },
        {
          "id": "byled",
          "title": "1 color for 1 led",
          "type": "boolean",
          "value": false
        },
        {
          "id": "stepTime",
          "title": "Step time",
          "type": "integer",
          "value": 500,
          "min": 0,
          "step": 1
        },
        {
          "id": "smooth",
          "title": "Smooth",
          "type": "boolean",
          "value": true
        },
        {
          "id": "easing",
          "title": "Easing",
          "type": "easing",
          "value": "linear"
        }
      ]
    },
    {
      "name": "trails",
      "title": "Trails Effect",
      "description": "Running trails",
      "properties": [
        {
          "id": "baseColor",
          "title": "Base color",
          "type": "color",
          "value": [
            0,
            60,
            0
          ]
        },
        {
          "id": "trailsColor",
          "title": "Trail color",
          "type": "color",
          "value": [
            0,
            255,
            0
          ]
        },
        {
          "id": "stepTime",
          "title": "Cycle time",
          "type": "integer",
          "value": 1500,
          "min": 1,
          "step": 1
        },
        {
          "id": "frequency",
          "title": "Trails space",
          "type": "integer",
          "value": 50,
          "min": 0,
          "step": 1
        },
        {
          "id": "adjustFrequency",
          "title": "Adjust frequency",
          "type": "boolean",
          "value": true
        },
        {
          "id": "attenuation",
          "title": "Attenuation %",
          "type": "integer",
          "value": 5,
          "min": 1,
          "step": 1
        },
        {
          "id": "maxTrailLength",
          "title": "Max trail length",
          "type": "integer",
          "value": 20,
          "min": 0,
          "step": 1
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        },
        {
          "id": "easing",
          "title": "Easing",
          "type": "easing",
          "value": "linear"
        }
      ]
    },
    {
      "name": "shine",
      "title": "Shine Effect",
      "description": "Randomly shining by independently changing color luminosity for each LED",
      "properties": [
        {
          "id": "stepTime",
          "title": "Step time",
          "type": "integer",
          "value": 100,
          "min": 1,
          "step": 1
        },
        {
          "id": "lightVariationPercent",
          "title": "Light variation (%)",
          "type": "integer",
          "value": 20,
          "min": 0,
          "max": 100,
          "step": 1
        },
        {
          "id": "baseColor",
          "title": "Base color",
          "type": "color",
          "value": [
            30,
            0,
            190
          ]
        }
      ]
    },
    {
      "name": "explode",
      "title": "Explosion Effect",
      "description": "Simulates an explosion blast and send particles",
      "properties": [
        {
          "id": "lifetime",
          "title": "Particle Life time",
          "type": "integer",
          "value": 3000,
          "min": 1,
          "step": 1
        },
        {
          "id": "maxTrailLength",
          "title": "Trail length",
          "type": "integer",
          "value": 8,
          "min": 0,
          "step": 1
        },
        {
          "id": "attenuation",
          "title": "Attenuation %",
          "type": "integer",
          "value": 12,
          "min": 0,
          "max": 100,
          "step": 1
        },
        {
          "id": "baseColor",
          "title": "Base Color",
          "type": "color",
          "value": [
            100,
            200,
            100
          ]
        },
        {
          "id": "stepTime",
          "title": "Cycle time",
          "type": "integer",
          "value": 5000,
          "min": 0,
          "step": 1
        },
        {
          "id": "easing",
          "title": "Easing",
          "type": "easing",
          "value": "easeInQuad"
        }
      ]
    },
    {
      "name": "stack",
      "title": "Stack Effect",
      "description": "Simulate a stack",
      "properties": [
        {
          "id": "sameTourTime",
          "title": "Same tour time",
          "type": "boolean",
          "value": true
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        },
        {
          "id": "enabledColor",
          "title": "Color 'ON'",
          "type": "color",
          "value": [
            255,
            0,
            0
          ]
        },
        {
          "id": "disabledColor",
          "title": "Color 'OFF'",
          "type": "color",
          "value": [
            0,
            0,
            0
          ]
        },
        {
          "id": "stepTime",
          "title": "Cycle time",
          "type": "integer",
          "value": 60000,
          "min": 0,
          "step": 1
        },
        {
          "id": "easing",
          "title": "Easing",
          "type": "easing",
          "value": "linear"
        },
        {
          "id": "_overriders",
          "type": "overriders",
          "value": [
            [
              "duration",
              60000
            ]
          ]
        }
      ]
    },
    {
      "name": "stepper",
      "title": "Stepper Effect",
      "description": "Define different steps (different color at different times)",
      "properties": [
        {
          "id": "smooth",
          "title": "Smooth",
          "value": true,
          "type": "boolean"
        },
        {
          "id": "steps",
          "title": "Steps",
          "value": [
            [
              0,
              255,
              0,
              0,
              "linear"
            ],
            [
              1000,
              255,
              255,
              0,
              "linear"
            ]
          ],
          "type": "steps"
        },
        {
          "id": "_overriders",
          "type": "overriders",
          "value": [
            [
              "duration",
              2000
            ]
          ]
        }
      ]
    },
    {
      "name": "candle",
      "title": "Candlelight Effect",
      "description": "Simulate a candle light effect",
      "properties": [
        {
          "id": "color",
          "title": "Color basis",
          "type": "color",
          "value": [
            223,
            156,
            0
          ]
        },
        {
          "id": "maxBrightnessChange",
          "title": "Brightness variability %",
          "value": 20,
          "type": "integer",
          "min": 0,
          "max": 100,
          "step": 1
        }
      ]
    },
    {
      "name": "rainbow",
      "title": "Rainbow Effect",
      "description": "Create a customizable & animatable rainbow effect",
      "properties": [
        {
          "id": "animated",
          "title": "Animated",
          "value": true,
          "type": "boolean"
        },
        {
          "id": "angleCover",
          "title": "Angle covered",
          "type": "integer",
          "value": 360,
          "min": 0,
          "max": 360,
          "step": 1
        },
        {
          "id": "offsetAngle",
          "title": "Angle offset",
          "type": "integer",
          "value": 0,
          "min": 0,
          "max": 360,
          "step": 1
        },
        {
          "id": "stepTime",
          "title": "Cycle time",
          "type": "integer",
          "value": 5000,
          "min": 0,
          "step": 1
        },
        {
          "id": "easing",
          "title": "Easing",
          "value": "linear",
          "type": "easing"
        }
      ]
    },
    {
      "name": "breath",
      "title": "Breath Effect",
      "description": "Smooth one or more color property.",
      "properties": [
        {
          "id": "easing",
          "title": "Easing",
          "value": "linear",
          "type": "easing"
        },
        {
          "id": "basecolor",
          "title": "Color basis",
          "type": "color",
          "value": [
            230,
            80,
            0
          ]
        },
        {
          "id": "inspiration_ratio",
          "title": "Inspiration %",
          "type": "integer",
          "min": "0",
          "max": "100",
          "value": 57
        },
        {
          "id": "stepTime",
          "title": "Cycle time",
          "type": "integer",
          "value": 5000,
          "min": 0,
          "step": 1
        }
      ]
    },
    {
      "name": "audio",
      "title": "Music Dancing",
      "description": "Follow current audio playing signal power.",
      "properties": [
        {
          "id": "linear",
          "title": "Linear morph",
          "value": false,
          "type": "boolean"
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal",
          "relevant": [
            [
              [
                "linear",
                true
              ]
            ]
          ]
        },
        {
          "id": "advanced",
          "title": "Advanced mode",
          "value": false,
          "type": "boolean"
        },
        {
          "id": "smooth",
          "title": "Smooth",
          "value": false,
          "type": "boolean",
          "relevant": [
            [
              [
                "linear",
                true
              ],
              [
                "advanced",
                true
              ]
            ]
          ]
        },
        {
          "id": "frequency-band",
          "title": "Based on",
          "value": "",
          "type": "frequency-band"
        },
        {
          "id": "slices",
          "title": "Slices",
          "value": [
            [
              10,
              0,
              10
            ],
            [
              255,
              0,
              255
            ]
          ],
          "type": "slices"
        },
        {
          "id": "_unique",
          "title": "Unique",
          "value": true,
          "type": "unique"
        }
      ]
    },
    {
      "name": "bouncing_ball",
      "title": "Bouncing Ball Effect",
      "description": "Simulates a bouncing ball",
      "properties": [
        {
          "id": "ballCount",
          "title": "Ball Count",
          "value": 1,
          "type": "integer",
          "min": 0
        },
        {
          "id": "color",
          "title": "Color basis",
          "type": "color",
          "value": [
            223,
            156,
            0
          ],
          "relevant": [
            [
              [
                "randomColors",
                false
              ]
            ]
          ]
        },
        {
          "id": "startHeight",
          "title": "Start height %",
          "value": 100,
          "type": "integer",
          "min": 1,
          "max": 100
        },
        {
          "id": "dampening",
          "title": "Dampening %",
          "value": 10,
          "type": "integer",
          "min": 1,
          "max": 99
        },
        {
          "id": "gravity",
          "title": "Gravity",
          "value": -9.81,
          "type": "integer",
          "max": -1
        },
        {
          "id": "trails",
          "title": "Trails",
          "value": true,
          "type": "boolean"
        },
        {
          "id": "trailsLength",
          "title": "Trails Length",
          "value": 11,
          "type": "integer",
          "min": 0,
          "relevant": [
            [
              [
                "trails",
                true
              ]
            ]
          ]
        },
        {
          "id": "randomColors",
          "title": "Random colors",
          "value": false,
          "type": "boolean"
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        }
      ]
    },
    {
      "name": "knight_rider",
      "title": "Knight Rider",
      "description": "Simulates the knight rider movie car light effect",
      "properties": [
        {
          "id": "scannerWidth",
          "title": "Scanner width",
          "value": 10,
          "type": "integer",
          "min": 1
        },
        {
          "id": "baseColor",
          "title": "Color basis",
          "type": "color",
          "value": [
            255,
            0,
            0
          ]
        },
        {
          "id": "stepTime",
          "title": "Cycle time",
          "type": "integer",
          "value": 1500,
          "min": 0,
          "step": 1
        },
        {
          "id": "breakTime",
          "title": "Break time",
          "value": 0,
          "type": "integer",
          "min": 0
        },
        {
          "id": "easing",
          "title": "Easing",
          "type": "easing",
          "value": "linear"
        }
      ]
    },
    {
      "name": "twinkle",
      "title": "Twinkle",
      "description": "Twinkle",
      "properties": [
        {
          "id": "randomColors",
          "title": "Random colors",
          "type": "boolean",
          "value": false
        },
        {
          "id": "baseColor",
          "title": "Base color",
          "value": [255, 0, 0],
          "type": "color",
          "min": 0,
          "relevant": [
            [
              [
                "randomColors",
                false
              ]
            ]
          ]
        },
        {
          "id": "stepTime",
          "title": "Step time",
          "value": 3000,
          "type": "integer",
          "min": 0
        },
        {
          "id": "stepsCount",
          "title": "Steps count",
          "value": 10,
          "type": "integer",
          "min": 1
        },
        {
          "id": "minEnabledPercent",
          "title": "Min OFF %",
          "value": 15,
          "type": "integer",
          "min": 0,
          "max": 100
        },
        {
          "id": "maxEnabledPercent",
          "title": "Max ON %",
          "value": 60,
          "type": "integer",
          "min": 0,
          "max": 100
        },
        {
          "id": "easing",
          "title": "Easing",
          "type": "easing",
          "value": "linear"
        }
      ]
    },
    {
      "name": "sparkle",
      "title": "Sparkle",
      "description": "Sparkle",
      "properties": [
        {
          "id": "randomColors",
          "title": "Random colors",
          "type": "boolean",
          "value": false
        },
        {
          "id": "baseColor",
          "title": "Base color",
          "value": [255, 255, 230],
          "type": "color",
          "min": 0,
          "relevant": [
            [
              [
                "randomColors",
                false
              ]
            ]
          ]
        },
        {
          "id": "minEnabledPercent",
          "title": "Min OFF %",
          "value": 15,
          "type": "integer",
          "min": 0,
          "max": 100
        },
        {
          "id": "maxEnabledPercent",
          "title": "Max ON %",
          "value": 60,
          "type": "integer",
          "min": 0,
          "max": 100
        },
        {
          "id": "stepTime",
          "title": "Step time",
          "value": 50,
          "type": "integer",
          "min": 0
        }
      ]
    },
    {
      "name": "moving_waves",
      "title": "Moving Waves",
      "description": "Moving Waves",
      "properties": [
        {
          "id": "baseColor",
          "title": "Base color",
          "value": [0, 255, 0],
          "type": "color",
          "min": 0
        },
        {
          "id": "waveSize",
          "title": "Wave Size",
          "value": 20,
          "type": "integer",
          "min": 0
        },
        {
          "id": "stepTime",
          "title": "Step Time",
          "value": 50,
          "type": "integer",
          "min": 0
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        },
        {
          "id": "forceSmooth",
          "title": "Force smooth",
          "type": "boolean",
          "value": true
        }
      ]
    },
    {
      "name": "color_wipe",
      "title": "Color Wipe",
      "description": "Color Wipe",
      "properties": [
        {
          "id": "stepTime",
          "title": "Step Time",
          "value": 50,
          "type": "integer",
          "min": 0
        },
        {
          "id": "colors",
          "title": "Colors",
          "value": [
            [0, 0, 0],
            [0, 0, 255],
            [255, 0, 0],
            [0, 255, 0],
            [255, 255, 0]
          ],
          "type": "color-set"
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        }
      ]
    },
    {
      "name": "theater_chase",
      "title": "Theater Chase",
      "description": "Theater Chase",
      "properties": [
        {
          "id": "baseColor",
          "title": "Base color",
          "type": "color",
          "value": [
            255,
            0,
            0
          ],
          "relevant": [
            [
              [
                "rainbow",
                false
              ]
            ]
          ]
        },
        {
          "id": "stepTime",
          "title": "Step Time",
          "value": 100,
          "type": "integer",
          "min": 0
        },
        {
          "id": "space",
          "title": "Space",
          "value": 4,
          "type": "integer",
          "min": 0
        },
        {
          "id": "rainbow",
          "title": "Rainbow",
          "type": "boolean",
          "value": false
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        },
        {
          "id": "forceSmooth",
          "title": "Force smooth",
          "type": "boolean",
          "value": true
        }
      ]
    },
    {
      "name": "fire",
      "title": "Fire Effect",
      "description": "Fire Effect",
      "properties": [
        {
          "id": "cooling",
          "title": "Cooling",
          "type": "integer",
          "value": 55,
          "min": 0,
          "max": 100,
        },
        {
          "id": "sparking",
          "title": "Sparking",
          "type": "integer",
          "value": 120,
          "min": 0,
          "max": 100,
        },
        {
          "id": "stepTime",
          "title": "Step Time",
          "value": 15,
          "type": "integer",
          "min": 1
        },
        {
          "id": "bothSides",
          "title": "Both sides",
          "type": "boolean",
          "value": false
        },
        {
          "id": "direction",
          "title": "Direction",
          "type": "direction",
          "value": "normal"
        }
      ]
    }
  ]
};
