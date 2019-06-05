'use strict'

var fs = require('fs')
var join = require('path').join
var duplicated = require('array-duplicated')
var yaml = require('js-yaml')
var unique = require('array-unique')

var files = fs
  .readdirSync(__dirname)
  .filter(function(basename) {
    return basename.indexOf('.yml') !== -1
  })
  .map(function(basename) {
    return yaml.load(String(fs.readFileSync(join(__dirname, basename))))
  })

// Create patterns.
var data = [].concat.apply([], files).map(function(entry) {
  var note = entry.note
  var source = entry.source
  var inconsiderate = clean(entry.inconsiderate)
  var categories = {}
  var parts = []
  var phrase
  var category

  if (source) {
    if (note) {
      note += ' (source: ' + source + ')'
    } else {
      note = 'Source: ' + source
    }
  }

  for (phrase in inconsiderate) {
    category = inconsiderate[phrase]

    if (!categories[category] || categories[category].length > phrase.length) {
      categories[category] = phrase
    }
  }

  for (phrase in categories) {
    parts.push(categories[phrase].replace(/[\s.]+/g, '-'))
  }

  return {
    id: parts.sort().join('-'),
    type: entry.type,
    apostrophe: entry.apostrophe ? true : undefined,
    categories: unique(Object.values(inconsiderate)),
    considerate: clean(entry.considerate),
    inconsiderate: inconsiderate,
    condition: entry.condition,
    note: note
  }
})

// Check patterns.
var phrases = []

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
          'Refrain from using dashes inside inconsiderate terms: they’ll be stripped when looking for words: ' +
            Object.keys(entry.inconsiderate).join(', ')
        )
      }

      if (/['’]/.test(inconsiderate) && !entry.apostrophe) {
        throw new Error(
          'Refrain from using apostrophes inside inconsiderate terms, they’ll be stripped when looking for words (or use `apostrophe: true`): ' +
            Object.keys(entry.inconsiderate).join(', ')
        )
      }
    })
  }
})

// Check for duplicates.
var duplicates = duplicated(phrases)

if (duplicates.length !== 0) {
  throw new Error('Refrain from multiple entries:\n  ' + duplicates.join(', '))
}

// Write patterns.
fs.writeFileSync(
  join(__dirname, '..', 'lib', 'patterns.json'),
  JSON.stringify(data, null, 2) + '\n'
)

// Clean a value.
function clean(value) {
  var copy

  if (typeof value === 'string') {
    value = [value]
  }

  if (value && 'length' in value && value.length !== 0) {
    copy = value
    value = {}

    copy.forEach(function(phrase) {
      value[phrase] = 'a' // Example category
    })
  }

  return value
}
