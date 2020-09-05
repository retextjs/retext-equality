'use strict'

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var duplicated = require('array-duplicated')
var yaml = require('js-yaml')
var unique = require('array-unique')
var not = require('not')
var hidden = require('is-hidden')
var pkg = require('../package.json')

var join = path.join
var extname = path.extname

var root = 'data'

// Generate all languages.
fs.readdirSync(root)
  .filter(not(hidden))
  .map(function (language) {
    return {language: language, root: join(root, language)}
  })
  .forEach(generateLanguage)

function generateLanguage(info) {
  var patterns = fs
    .readdirSync(info.root)
    .filter(not(hidden))
    .filter(function (basename) {
      return extname(basename) === '.yml'
    })
    .map(function (basename) {
      return yaml.load(String(fs.readFileSync(join(info.root, basename))))
    })
    .reduce(function (all, cur) {
      return all.concat(cur)
    }, [])

  var data = patterns.map(function (entry) {
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

      if (
        !categories[category] ||
        categories[category].length > phrase.length
      ) {
        categories[category] = phrase
      }
    }

    for (phrase in categories) {
      parts.push(categories[phrase].replace(/[\s.]+/g, '-'))
    }

    return {
      id: parts.sort().join('-').toLowerCase(),
      type: entry.type,
      apostrophe: entry.apostrophe ? true : undefined,
      categories: unique(Object.values(inconsiderate)),
      considerate: clean(entry.considerate),
      inconsiderate: inconsiderate,
      condition: entry.condition,
      note: note,
      source
    }
  })

  // Check patterns.
  var phrases = []

  data.forEach(function (entry) {
    if (entry.type !== 'basic' && entry.categories.length < 2) {
      throw new Error(
        'Use `type: basic` for single entries with one category: ' +
          Object.keys(entry.inconsiderate).join(', ')
      )
    }

    if (entry.inconsiderate) {
      Object.keys(entry.inconsiderate).forEach(function (inconsiderate) {
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
    throw new Error(
      'Refrain from multiple entries:\n  ' + duplicates.join(', ')
    )
  }

  var basename = info.language + '.json'
  var scriptname = info.language + '.js'

  // Write patterns.
  fs.writeFileSync(join('lib', basename), JSON.stringify(data, null, 2) + '\n')

  console.log(chalk.green('✓') + ' wrote `lib/' + basename + '`')

  fs.writeFileSync(
    scriptname,
    [
      "'use strict'",
      '',
      "var factory = require('./lib/factory.js')",
      "var patterns = require('./lib/" + basename + "')",
      '',
      "module.exports = factory(patterns, '" + info.language + "')",
      ''
    ].join('\n')
  )

  console.log(chalk.green('✓') + ' wrote `' + scriptname + '`')

  if (pkg.files.indexOf(scriptname) === -1) {
    throw new Error(
      'Please add `' + scriptname + '` to `files` in `package.json`'
    )
  }
}

// Clean a value.
function clean(value) {
  var copy

  if (typeof value === 'string') {
    value = [value]
  }

  if (value && 'length' in value && value.length !== 0) {
    copy = value
    value = {}

    copy.forEach(function (phrase) {
      value[phrase] = 'a' // Example category
    })
  }

  return value
}
