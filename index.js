const debug = require('debug')('instrumentlights')
const Bacon = require('baconjs');
const util = require('util')
const _ = require('lodash')
var SunCalc = require('suncalc')

// Seatalk1:
const lampOff = "80,00,00"
const lampdim = "80,00,04"
const lampOn = "80,00,08"
const lampBright = "80,00,0C"
/*80  00  0X      Set Lamp Intensity: X=0 off, X=4: 1, X=8: 2, X=C: 3*/

const lightLevel = [
  "off",
  "dim",
  "on",
  "bright"
]

module.exports = function(app) {
  var unsubscribe = undefined
  var plugin = {}

  plugin.start = function(props) {
    debug("starting...")
    debug("started")
  }
  
    plugin.stop = function() {
    debug("stopping")
    if (unsubscribe) {
      unsubscribe()
    }
    debug("stopped")
  }
  
  plugin.id = "instrumentlights"
  plugin.name = "Instrument lights"
  plugin.description = "Plugin that controls Raymarine Seatalk 1 instrument lights"

  plugin.schema = {
    title: "Raymarine Autopilot Control",
    type: "object",
    properties: {
      Display_sunsetSunrise: {
        title: "Display lights on from sunset till sunrise",
        type: "string",
              default: "off",
              "enum": lightLevel
      },
      Display_civil_DuskDawn: {
        title: "Display lights on from dusk till dawn (civil 6deg below horizon)",
        type: "string",
              default: "off",
              "enum": lightLevel
      },
      Display_naut_DuskDawn: {
        title: "Display lights on from dusk till dawn (nautical 12deg)",
        type: "string",
              default: "off",
              "enum": lightLevel
      },
      Display_astro_DuskDawn: {
        title: "Display lights on from dusk till dawn (astronomical 18deg)",
        type: "string",
              default: "off",
              "enum": lightLevel
      },
      }
  }

  return plugin;
}

