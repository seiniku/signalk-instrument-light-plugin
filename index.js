const debug = require('debug')('instrumentlights')
const Bacon = require('baconjs');
const util = require('util')
const _ = require('lodash')
var SunCalc = require('suncalc')
const signalkSchema = require('signalk-schema')
const react = require('react/package.json') // react is a peer dependency.
const rjf = require('react-jsonschema-form')

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
    isItTime()
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
  plugin.description = "Plugin that controls proprietary instrument lights"

  plugin.schema = {
    title: "Plugin that controls proprietary instrument lights",
    description: "Current solar altitude is INSERT degrees",
    type: "object",
    properties: {
      Seatalk1: {
        title: "Seatalk1 instruments",
        type: "boolean",
        default: false
      },
      FDX: {
        title: "Silva/Nexus/Garmin instruments (FDX)",
        type: "boolean",
        default: false
      },
      Display_sunsetSunrise: {
        title: "Display lights during day (from sunset till sunrise)",
        type: "number",
              default: 0,
              "enum": [0,1,2,3],
              "enumNames": ["off", "dim", "on", "bright"]
      },
      Display_civil_DuskDawn: {
        title: "Display lights during civil twilight (0-6 deg below horizon)",
        type: "number",
              default: 0,
              "enum": [0,1,2,3],
              "enumNames": ["off", "dim", "on", "bright"]
      },
      Display_naut_DuskDawn: {
        title: "Display lights during nautical twilight (6-12 deg below horizon)",
        type: "number",
              default: 0,
              "enum": [0,1,2,3],
              "enumNames": ["off", "dim", "on", "bright"]
      },
      Display_night: {
        title: "Display lights on during night (sun below 12 deg)",
        type: "number",
              default: 0,
              "enum": [0,1,2,3],
              "enumNames": ["off", "dim", "on", "bright"]
      },
      }
  }

  return plugin;
}

function isItTime (option){

  var minutes = 1, the_interval = minutes * 60 * 1000
  setInterval(function() {
    debug("I am doing my " + minutes + " minutes check")
    var now = new Date()
    var lat = 59.911491
    var lon = 10.757933
    var times = SunCalc.getTimes(now, lat, lon)
    if (times.sunrise < now && times.sunset > now ){
      //day
      debug("daytime!")
    } else if (times.dawn < now || times.dusk > now){
        if (times.nauticalDawn < now || times.nauticalDusk > now){
          if (times.nightEnd > now || times.night < now){
            //night
            debug("nighttime!")
          } else {
            //nautical
            debug("nautical twilight")
          }
        } else {
          //civil
          debug("Civil twilight")
        }
      }
  }, the_interval)
}
