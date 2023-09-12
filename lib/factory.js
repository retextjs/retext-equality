/**
 * @typedef {import('nlcst').Parents} Parents
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('nlcst').RootContent} RootContent
 *
 * @typedef {import('nlcst-search').Handler} SearchHandle
 *
 * @typedef {import('vfile').VFile} VFile
 *
 * @typedef {import('./en.js').Pattern} Pattern
 */

/**
 * @typedef Match
 *   Match.
 * @property {string} type
 *   Type of match.
 * @property {Parents} parent
 *   Parent of `nodes`.
 * @property {Array<RootContent>} nodes
 *   Nodes that match.
 * @property {number} start
 *   Position of first of `nodes` in `parent`.
 * @property {number} end
 *   Position of last of `nodes` in `parent`.
 *
 * @typedef Options
 *   Configuration.
 * @property {ReadonlyArray<string> | null | undefined} [ignore]
 *   List of phrases to ignore (optional).
 * @property {boolean | null | undefined} [noBinary=false]
 *   Whether to warn for “he or she” and similar (default: `false`).
 */

import {ok as assert} from 'devlop'
import {normalize} from 'nlcst-normalize'
import {search} from 'nlcst-search'
import {toString} from 'nlcst-to-string'
import {quotation} from 'quotation'
import {pointEnd, pointStart} from 'unist-util-position'
import {SKIP, visit} from 'unist-util-visit'

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {ReadonlyArray<never>} */
const emptyList = []

/**
 * @param {ReadonlyArray<Pattern>} patterns
 *   Patterns.
 * @param {string} lang
 *   Language.
 * @returns
 *   Plugin.
 */
export function factory(patterns, lang) {
  /* c8 ignore next -- needed for other languages in the future. */
  const source = 'retext-equality' + (lang === 'en' ? '' : '-' + lang)
  // Several pattern types can be handled.
  // Handlers are stored in this map by type.
  const handlers = {basic, or}

  // Internal mapping.
  /** @type {Map<string, Pattern>} */
  const byId = new Map()
  /** @type {Map<string, string>} */
  const byPhrase = new Map()
  /** @type {Set<string>} */
  const apostrophes = new Set()

  unpack()

  /**
   * Check for possible insensitive, inconsiderate language.
   *
   * @param {Readonly<Options> | null | undefined} [options]
   *   Configuration (optional).
   * @returns
   *   Transform.
   */
  return function (options) {
    const settings = options || emptyOptions
    const ignore = settings.ignore || emptyList
    const noBinary = settings.noBinary || false
    /** @type {Array<string>} */
    const noNormalize = []
    /** @type {Array<string>} */
    const normalize = []

    for (const item of byPhrase.keys()) {
      if (ignore.includes(item)) {
        continue
      }

      if (apostrophes.has(item)) {
        noNormalize.push(item)
      } else {
        normalize.push(item)
      }
    }

    /**
     * Transform.
     *
     * @param {Root} tree
     *   Tree.
     * @param {VFile} file
     *   File.
     * @returns {undefined}
     *   Nothing.
     */
    return function (tree, file) {
      visit(tree, 'ParagraphNode', function (node) {
        /** @type {Map<string, Array<Match>>} */
        const matchesById = new Map()

        search(node, normalize, handle)
        search(node, noNormalize, handle, {allowApostrophes: true})

        // Ignore or emit offending words based on their pattern.
        for (const [id, matches] of matchesById.entries()) {
          const pattern = byId.get(id)
          assert(pattern)
          const kind =
            pattern.type === 'or' && noBinary ? 'basic' : pattern.type
          handlers[kind](matches, pattern, file)
        }

        return SKIP

        // Handle a match.
        /** @type {SearchHandle} */
        function handle(match, position, parent, phrase) {
          const id = byPhrase.get(phrase)
          assert(id)

          if (phrase !== phrase.toLowerCase() && toString(match) !== phrase) {
            return
          }

          const pattern = byId.get(id)
          assert(pattern)

          let matches = matchesById.get(id)

          if (!matches) {
            matches = []
            matchesById.set(id, matches)
          }

          matches.push({
            end: position + match.length - 1,
            nodes: match,
            parent,
            start: position,
            type: pattern.inconsiderate[phrase]
          })
        }
      })
    }
  }

  function unpack() {
    let index = -1

    while (++index < patterns.length) {
      const pattern = patterns[index]

      byId.set(pattern.id, pattern)

      /** @type {string} */
      let phrase

      for (phrase in pattern.inconsiderate) {
        if (Object.hasOwn(pattern.inconsiderate, phrase)) {
          byPhrase.set(phrase, pattern.id)
          if (pattern.apostrophe) apostrophes.add(phrase)
        }
      }
    }
  }

  /**
   * Handle matches for a `basic` pattern.
   * **Basic** patterns need no extra logic, every match is emitted as a
   * warning.
   *
   * @param {ReadonlyArray<Readonly<Match>>} matches
   *   Matches.
   * @param {Readonly<Pattern>} pattern
   *   Pattern.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  function basic(matches, pattern, file) {
    let index = -1

    while (++index < matches.length) {
      warn(file, matches[index], pattern)
    }
  }

  /**
   * Handle matches for an **or** pattern.
   * **Or** patterns emit a warning unless every category is present.
   *
   * For example, when `him` and `her` occur adjacent to each other, they are not
   * warned about.
   * But when they occur alone, they are.
   *
   * @param {ReadonlyArray<Readonly<Match>>} matches
   *   Matches.
   * @param {Readonly<Pattern>} pattern
   *   Pattern.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  function or(matches, pattern, file) {
    let index = -1

    while (++index < matches.length) {
      const match = matches[index]
      const siblings = match.parent.children
      const next = matches[index + 1]

      if (next && next.parent === match.parent && next.type !== match.type) {
        let start = match.end

        while (++start < next.start) {
          const sibling = siblings[start]

          if (
            sibling.type === 'WhiteSpaceNode' ||
            (sibling.type === 'WordNode' &&
              /(and|or)/.test(normalize(sibling))) ||
            (sibling.type === 'PunctuationNode' && normalize(sibling) === '/')
          ) {
            continue
          }

          break
        }

        // If we didn’t break…
        if (start === next.start) {
          index++
          continue
        }
      }

      warn(file, match, pattern)
    }
  }

  /**
   * @param {VFile} file
   *   File.
   * @param {Readonly<Match>} match
   *   Match.
   * @param {Readonly<Pattern>} pattern
   *   Pattern.
   * @returns {undefined}
   *   Nothing.
   */
  function warn(file, match, pattern) {
    const actual = toString(match.nodes)
    /** @type {Array<string> | undefined} */
    let expected

    if (pattern.considerate) {
      expected = Object.keys(pattern.considerate)

      // Capitalize suggestions.
      if (actual.charAt(0).toUpperCase() === actual.charAt(0)) {
        let index = -1

        while (++index < expected.length) {
          expected[index] =
            expected[index].charAt(0).toUpperCase() + expected[index].slice(1)
        }
      }
    }

    const end = pointEnd(match.nodes[match.nodes.length - 1])
    const start = pointStart(match.nodes[0])

    const message = file.message(
      quotation(actual, '`') +
        ' may be insensitive' +
        (pattern.condition ? ', ' + pattern.condition : '') +
        ', ' +
        (expected
          ? 'use ' + quotation(expected, '`').join(', ') + ' instead'
          : 'try not to use it'),
      {
        /* c8 ignore next -- verbose to test. */
        place: end && start ? {start, end} : undefined,
        ruleId: pattern.id,
        source
      }
    )

    message.actual = actual
    message.expected = expected
    message.note = pattern.note
    message.url = 'https://github.com/retextjs/retext-equality#readme'
  }
}
