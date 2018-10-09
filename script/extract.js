'use strict'

var fs = require('fs')
var path = require('path')
var duplicated = require('array-duplicated')
var yaml = require('js-yaml')

var join = path.join
var read = fs.readFileSync
var write = fs.writeFileSync
var stringify = JSON.stringify

var data
var phrases
var duplicates

data = fs
  .readdirSync(__dirname)
  .filter(function(basename) {
    return basename.indexOf('.yml') !== -1
  })
  .map(function(basename) {
    return yaml.load(read(join(__dirname, basename), 'utf8'))
  })

data = [].concat.apply([], data)

data.forEach(function(entry) {
  entry.inconsiderate = clean(entry.inconsiderate)
  entry.considerate = clean(entry.considerate)
  entry.categories = Object.keys(entry.inconsiderate)
    .map(function(key) {
      return entry.inconsiderate[key]
    })
    .filter(function(value, index, parent) {
      return parent.indexOf(value, index + 1) === -1
    })
})

/* Patch. */
phrases = []

data = data.map(patch)

data.forEach(function(entry) {
  if (entry.type !== 'simple' && entry.categories.length < 2) {
    throw new Error(
      'Use `type: simple` for single entries with one category: ' +
        Object.keys(entry.inconsiderate).join(', ')
    )
  }

  if (entry.inconsiderate) {
    Object.keys(entry.inconsiderate).forEach(function(inconsiderate) {
      phrases.push(inconsiderate)

      if (/-/.test(inconsiderate)) {
        throw new Error(
          'Refrain from using dashes inside inconsiderate ' +
            'terms: they’ll be stripped when looking for ' +
            'words: ' +
            Object.keys(entry.inconsiderate).join(', ')
        )
      }

      if (/['’]/.test(inconsiderate) && !entry.apostrophe) {
        throw new Error(
          'Refrain from using apostrophes inside ' +
            'inconsiderate terms, they’ll be stripped ' +
            'when looking for words (or use `apostrophe: ' +
            'true`): ' +
            Object.keys(entry.inconsiderate).join(', ')
        )
      }
    })
  }
})

duplicates = duplicated(phrases)

if (duplicates.length !== 0) {
  throw new Error('Refrain from multiple entries:\n  ' + duplicates.join(', '))
}

/* Write. */
data = stringify(data, 0, 2) + '\n'

write(join(__dirname, '..', 'lib', 'patterns.json'), data)

/* Get a unique identifier for a pattern. */
function getPatternId(pattern) {
  var inconsiderate = pattern.inconsiderate
  var phrases = {}
  var result = []
  var phrase
  var category

  for (phrase in inconsiderate) {
    category = inconsiderate[phrase]

    if (!phrases[category] || phrases[category].length > phrase.length) {
      phrases[category] = phrase
    }
  }

  for (phrase in phrases) {
    result.push(phrases[phrase].replace(/[\s.]+/g, '-'))
  }

  return result.sort().join('-')
}

/* Patch information on `entry`. */
function patch(entry) {
  var description = entry.note
  var source = entry.source
  var result = {
    id: null,
    type: entry.type,
    apostrophe: entry.apostrophe ? true : undefined,
    categories: entry.categories,
    considerate: entry.considerate,
    inconsiderate: entry.inconsiderate,
    condition: entry.condition
  }

  if (source) {
    if (description) {
      description += ' (source: ' + source + ')'
    } else {
      description = 'Source: ' + source
    }
  }

  result.note = description
  result.id = getPatternId(result)

  return result
}

/* Clean a value. */
function clean(value) {
  var copy

  if (typeof value === 'string') {
    value = [value]
  }

  if ('length' in value && value.length !== 0) {
    copy = value
    value = {}

    copy.forEach(function(phrase) {
      value[phrase] = 'a' /* Example category */
    })
  }

  return value
}
