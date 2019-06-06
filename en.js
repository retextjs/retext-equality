'use strict'

var factory = require('./lib/factory.js')
var patterns = require('./lib/en.json')

module.exports = factory(patterns, 'en')
