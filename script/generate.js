/**
 * @typedef Pattern
 *   Pattern.
 * @property {boolean | undefined} [apostrophe]
 *   Whether the pattern contains intentional apostrophes (default: `false`).
 * @property {Array<string>} categories
 *   Categories.
 * @property {string | undefined} [condition]
 *   Extra condition (optional).
 * @property {Record<string, string> | undefined} [considerate]
 *   Considerate alternatives.
 * @property {string} id
 *   Unique identifier.
 * @property {Record<string, string>} inconsiderate
 *   Inconsiderate values.
 * @property {string | undefined} [note]
 *   Note (optional).
 * @property {'basic' | 'or'} type
 *   Type.
 *
 * @typedef RawPattern
 *   Pattern from YAML.
 * @property {boolean} [apostrophe]
 *   Whether the pattern contains intentional apostrophes.
 * @property {string} [condition]
 *   Extra condition (optional).
 * @property {Record<string, string> | Array<string> | string} considerate
 *   Considerate alternatives.
 * @property {Record<string, string> | Array<string> | string} inconsiderate
 *   Inconsiderate values.
 * @property {string} [note]
 *   Extra note.
 * @property {string} [source]
 *   Source of pattern.
 * @property {'basic' | 'or'} type
 *   Type.
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {isHidden} from 'is-hidden'
import yaml from 'yaml'

const dataUrl = new URL('../data/', import.meta.url)

const languages = await fs.readdir(dataUrl)

let index = -1

while (++index < languages.length) {
  const language = languages[index]

  if (isHidden(language)) {
    continue
  }

  const languageUrl = new URL(language + '/', dataUrl)
  const files = await fs.readdir(languageUrl)
  /** @type {Array<RawPattern>} */
  const rawPatterns = []

  let fileIndex = -1
  while (++fileIndex < files.length) {
    const filename = files[fileIndex]

    if (isHidden(filename)) {
      continue
    }

    assert(filename.endsWith('.yml'), 'expected `' + filename + '` to be yaml')

    const buf = await fs.readFile(new URL(filename, languageUrl))

    rawPatterns.push(...yaml.parse(String(buf)))
  }

  /** @type {Set<string>} */
  const phrases = new Set()

  const data = rawPatterns.map(function (entry) {
    const inconsiderate = clean(entry.inconsiderate)
    /** @type {Record<string, string>} */
    const categories = {}
    /** @type {Array<string>} */
    const parts = []
    /** @type {string} */
    let phrase

    for (phrase in inconsiderate) {
      if (Object.hasOwn(inconsiderate, phrase)) {
        const category = inconsiderate[phrase]

        assert(
          !phrases.has(phrase),
          'unexpected duplicate entry `' + phrase + '`'
        )

        phrases.add(phrase)

        assert(
          !/-/.test(phrase),
          'unexpected dashes in inconsiderate term (`' +
            phrase +
            '`), they’ll be stripped when looking for words: remove them'
        )

        assert(
          entry.apostrophe || !/['’]/.test(phrase),
          'unexpected apostrophes in inconsiderate terms (`' +
            phrase +
            '`), they’ll be stripped when looking for words: remove them or add `apostrophe: true`'
        )

        if (
          !categories[category] ||
          categories[category].length > phrase.length
        ) {
          categories[category] = phrase
        }
      }
    }

    for (phrase in categories) {
      if (Object.hasOwn(categories, phrase)) {
        parts.push(categories[phrase].replace(/[\s.]+/g, '-'))
      }
    }

    /** @type {Pattern} */
    const pattern = {
      apostrophe: entry.apostrophe ? true : undefined,
      categories: [...new Set(Object.values(inconsiderate))],
      condition: entry.condition,
      considerate: clean(entry.considerate),
      id: parts.sort().join('-').toLowerCase(),
      inconsiderate,
      note:
        entry.note && entry.source
          ? entry.note + ' (source: ' + entry.source + ')'
          : entry.source
            ? 'Source: ' + entry.source
            : entry.note || undefined,
      type: entry.type
    }

    assert(
      pattern.type === 'basic' || pattern.categories.length > 1,
      'unexpected single category in non-basic pattern (' +
        Object.keys(pattern.inconsiderate).join(', ') +
        '), add: `type: basic`'
    )

    return pattern
  })

  data.sort(function (a, b) {
    return a.id.localeCompare(b.id, 'en')
  })

  // Write patterns.
  await fs.writeFile(
    new URL('../lib/patterns-' + language + '.js', import.meta.url),
    [
      '/**',
      ' * @typedef Pattern',
      ' * @property {boolean} [apostrophe]',
      ' * @property {Array<string>} categories',
      ' * @property {string} [condition]',
      ' * @property {Record<string, string>} [considerate]',
      ' * @property {string} id',
      ' * @property {Record<string, string>} inconsiderate',
      ' * @property {string} [note]',
      " * @property {'or' | 'basic'} type",
      ' */',
      '',
      '/** @type {ReadonlyArray<Pattern>} */',
      'export const patterns = ' + JSON.stringify(data, undefined, 2),
      ''
    ].join('\n')
  )

  console.log('✓ wrote `lib/patterns-' + language + '.js`')

  await fs.writeFile(
    new URL('../lib/' + language + '.js', import.meta.url),
    [
      '/**',
      " * @typedef {import('./create-plugin.js').Options} Options",
      ' */',
      '',
      "import {createPlugin} from './create-plugin.js'",
      "import {patterns} from './patterns-" + language + ".js'",
      '',
      "const retextEquality = createPlugin(patterns, '" + language + "')",
      '',
      'export default retextEquality',
      ''
    ].join('\n')
  )

  console.log('✓ wrote `lib/' + language + '.js`')
}

/**
 * Clean a value.
 *
 * @param {Record<string, string> | Array<string> | string} value
 *   Values.
 * @returns {Record<string, string>}
 *   Clean values.
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
