'use strict'

var sprintf = require('sprintf')
  , extend = require('lodash.assign')

function ConsoleHistogram (options) {
  this.options = extend({ binSize: 10, showZero: false, xLabel: '', yLabel: '' }, options)
  this.min = Number.POSITIVE_INFINITY
  this.max = 0
  this.bins = {}
  this.maxBin = 0
  this.averageSum = 0
  this.count = 0
}

ConsoleHistogram.prototype.crunch = function (value) {
  var v = parseInt(value, 10)
    , bin = Math.floor(v / this.options.binSize) * this.options.binSize
  this.averageSum += v
  this.count += 1
  this.min = Math.floor(Math.min(this.min, v) / this.options.binSize) * this.options.binSize
  this.max = Math.max(this.max, v)
  this.bins[bin] = this.bins[bin] === undefined ? 1 : this.bins[bin] + 1
  this.maxBin = Math.max(this.maxBin, this.bins[bin])
}

ConsoleHistogram.prototype.printLabels = function (valueDigitLength) {
  if (this.options.xLabel || this.options.yLabel) {
    valueDigitLength = Math.max(this.options.yLabel.length, valueDigitLength)
    console.log(sprintf('%' + valueDigitLength + 's | %s', this.options.yLabel, this.options.xLabel))
  }
}

ConsoleHistogram.prototype.print = function () {
  var ratio = (process.stdout.columns / 1.5) / this.maxBin
    , valueDigitLength = (this.max + '').length
    , count = 0
    , xValue
    , i
  this.printLabels(valueDigitLength)
  for (i = this.min; i <= this.max; i += this.options.binSize) {
    count = (this.bins[i] || 0)
    if ((count > 0) || this.options.showZero) {
      xValue = Math.floor(count * ratio)
      console.log(sprintf('%' + valueDigitLength + 'd | %s%s', i
        , Array(xValue).join('-'), (xValue > 1) ? ' ' + count : count))
    }
  }
}

ConsoleHistogram.prototype.printAverage = function () {
  console.log('%s values plotted with an average of %s %s per %s', this.count, this.averageSum / this.count
    , this.options.yLabel, this.options.xLabel)
}

module.exports = ConsoleHistogram
