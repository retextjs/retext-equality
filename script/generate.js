import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import yaml from 'js-yaml'
import {isHidden} from 'is-hidden'

/** @type {{files: string[]}} */
const pkg = JSON.parse(String(fs.readFileSync('package.json')))

const own = {}.hasOwnProperty

const files = fs.readdirSync('data')
let index = -1

while (++index < files.length) {
  const language = files[index]

  if (isHidden(language)) {
    continue
  }

  /**
   * @type {(
   *   Array.<{
   *     type: 'or'|'basic',
   *     considerate: string|string[]|Record<string, string>,
   *     inconsiderate: string|string[]|Record<string, string>,
   *     condition?: string,
   *     note?: string,
   *     source?: string,
   *     apostrophe?: boolean
   *   }>
   * )}
   */
  // @ts-expect-error: hush
  const patterns = fs
    .readdirSync(path.join('data', language))
    .filter((d) => !isHidden(d))
    .filter((d) => path.extname(d) === '.yml')
    .flatMap((d) =>
      yaml.load(String(fs.readFileSync(path.join('data', language, d))))
    )

  /** @type {string[]} */
  const phrases = []

  const data = patterns.map((entry) => {
    const inconsiderate = clean(entry.inconsiderate)
    /** @type {Record<string, string>} */
    const categories = {}
    /** @type {string[]} */
    const parts = []
    const note =
      entry.note && entry.source
        ? entry.note + ' (source: ' + entry.source + ')'
        : entry.source
        ? 'Source: ' + entry.source
        : entry.note || undefined
    /** @type {string} */
    let phrase

    for (phrase in inconsiderate) {
      if (own.call(inconsiderate, phrase)) {
        const category = inconsiderate[phrase]

        phrases.push(phrase)

        if (/-/.test(phrase)) {
          throw new Error(
            'Refrain from using dashes inside inconsiderate terms: they’ll be stripped when looking for words: ' +
              Object.keys(inconsiderate).join(', ')
          )
        }

        if (/['’]/.test(phrase) && !entry.apostrophe) {
          throw new Error(
            'Refrain from using apostrophes inside inconsiderate terms, they’ll be stripped when looking for words (or use `apostrophe: true`): ' +
              Object.keys(inconsiderate).join(', ')
          )
        }

        if (
          !categories[category] ||
          categories[category].length > phrase.length
        ) {
          categories[category] = phrase
        }
      }
    }

    for (phrase in categories) {
      if (own.call(categories, phrase)) {
        parts.push(categories[phrase].replace(/[\s.]+/g, '-'))
      }
    }

    return {
      id: parts.sort().join('-').toLowerCase(),
      type: entry.type,
      apostrophe: entry.apostrophe ? true : undefined,
      categories: [...new Set(Object.values(inconsiderate))],
      considerate: clean(entry.considerate),
      inconsiderate,
      condition: entry.condition,
      note
    }
  })

  // Check patterns.
  let offset = -1

  while (++offset < data.length) {
    const entry = data[offset]

    if (entry.type !== 'basic' && entry.categories.length < 2) {
      throw new Error(
        'Use `type: basic` for single entries with one category: ' +
          Object.keys(entry.inconsiderate).join(', ')
      )
    }
  }

  // Check for duplicates.
  offset = -1
  while (++offset < phrases.length) {
    if (phrases.includes(phrases[offset], offset + 1)) {
      throw new Error('Refrain from multiple entries:\n  ' + phrases[offset])
    }
  }

  // Write patterns.
  fs.writeFileSync(
    path.join('lib', language + '.js'),
    [
      '/**',
      ' * @typedef Pattern',
      ' * @property {string} id',
      " * @property {'or'|'basic'} type",
      ' * @property {string[]} categories',
      ' * @property {Record<string, string>} [considerate]',
      ' * @property {Record<string, string>} inconsiderate',
      ' * @property {string} [condition]',
      ' * @property {string} [note]',
      ' * @property {boolean} [apostrophe]',
      ' */',
      '',
      '/** @type {Pattern[]} */',
      'export const patterns = ' + JSON.stringify(data, null, 2),
      ''
    ].join('\n')
  )

  console.log(chalk.green('✓') + ' wrote `lib/' + language + '.js`')

  fs.writeFileSync(
    language + '.js',
    [
      "import {factory} from './lib/factory.js'",
      "import {patterns} from './lib/" + language + ".js'",
      '',
      "const retextEquality = factory(patterns, '" + language + "')",
      '',
      'export default retextEquality',
      ''
    ].join('\n')
  )

  console.log(chalk.green('✓') + ' wrote `' + language + '.js`')

  if (!pkg.files.includes(language + '.js')) {
    throw new Error(
      'Please add `' + language + '.js` to `files` in `package.json`'
    )
  }
}

/**
 * Clean a value.
 *
 * @param {string|string[]|Record<string, string>} value
 * @returns {Record<string, string>}
 */
function clean(value) {
  if (typeof value === 'string') {
    value = [value]
  }

  if (Array.isArray(value)) {
    /** @type {Record<string, string>} */
    const replacement = {}
    let index = -1

    while (++index < value.length) {
      replacement[value[index]] = 'a' // Example category
    }

    return replacement
  }

  return value
}
