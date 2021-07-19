import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import duplicated from 'array-duplicated'
import yaml from 'js-yaml'
import unique from 'array-unique'
import not from 'not'
import hidden from 'is-hidden'

const pkg = JSON.parse(fs.readFileSync('package.json'))

// Generate all languages.
const files = fs
  .readdirSync('data')
  .filter(not(hidden))
  .map((language) => ({language, root: path.join('data', language)}))
let index = -1

while (++index < files.length) {
  const info = files[index]

  var patterns = fs
    .readdirSync(info.root)
    .filter(not(hidden))
    .filter((d) => path.extname(d) === '.yml')
    .map((d) => yaml.load(String(fs.readFileSync(path.join(info.root, d)))))
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
      inconsiderate,
      condition: entry.condition,
      note
    }
  })

  // Check patterns.
  var phrases = []
  let offset = -1

  while (++offset < data.length) {
    const entry = data[offset]

    if (entry.type !== 'basic' && entry.categories.length < 2) {
      throw new Error(
        'Use `type: basic` for single entries with one category: ' +
          Object.keys(entry.inconsiderate).join(', ')
      )
    }

    if (entry.inconsiderate) {
      let inconsiderate

      for (inconsiderate in entry.inconsiderate) {
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
      }
    }
  }

  // Check for duplicates.
  var duplicates = duplicated(phrases)

  if (duplicates.length > 0) {
    throw new Error(
      'Refrain from multiple entries:\n  ' + duplicates.join(', ')
    )
  }

  // Write patterns.
  fs.writeFileSync(
    path.join('lib', info.language + '.js'),
    'export const patterns = ' + JSON.stringify(data, null, 2) + '\n'
  )

  console.log(chalk.green('✓') + ' wrote `lib/' + info.language + '.js`')

  fs.writeFileSync(
    info.language + '.js',
    [
      "import {factory} from './lib/factory.js'",
      "import {patterns} from './lib/" + info.language + ".js'",
      '',
      "const retextEquality = factory(patterns, '" + info.language + "')",
      '',
      'export default retextEquality',
      ''
    ].join('\n')
  )

  console.log(chalk.green('✓') + ' wrote `' + info.language + '.js`')

  if (pkg.files.indexOf(info.language + '.js') === -1) {
    throw new Error(
      'Please add `' + info.language + '.js` to `files` in `package.json`'
    )
  }
}

// Clean a value.
function clean(value) {
  if (typeof value === 'string') {
    value = [value]
  }

  if (Array.isArray(value)) {
    const replacement = {}
    let index = -1

    while (++index < value.length) {
      replacement[value[index]] = 'a' // Example category
    }

    return replacement
  }

  return value
}
