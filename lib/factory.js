import {normalize} from 'nlcst-normalize'
import {search} from 'nlcst-search'
import {toString} from 'nlcst-to-string'
import {quotation} from 'quotation'
import {visit, SKIP} from 'unist-util-visit'
import {convert} from 'unist-util-is'

const own = {}.hasOwnProperty

const word = convert('WordNode')
const whiteSpace = convert('WhiteSpaceNode')
const punctuation = convert('PunctuationNode')

export function factory(patterns, lang) {
  // Needed for other languages.
  /* c8 ignore next */
  const source = 'retext-equality' + (lang === 'en' ? '' : '-' + lang)

  // Several pattern types can be handled.
  // Handlers are stored in this map by type.
  const handlers = {or, basic}

  // Internal mapping.
  const byId = []
  const byIndex = []
  const apostrophes = []
  const list = []

  unpack()

  return (options = {}) => {
    const ignore = options.ignore || []
    const noBinary = options.noBinary
    const noNormalize = []
    const normalize = []
    let index = -1

    while (++index < list.length) {
      const item = list[index]

      if (ignore.includes(item)) {
        continue
      }

      if (apostrophes.includes(item)) {
        noNormalize.push(item)
      } else {
        normalize.push(item)
      }
    }

    return (tree, file) => {
      visit(tree, 'ParagraphNode', (node) => {
        const matches = {}

        search(node, normalize, handle)
        search(node, noNormalize, handle, true)

        let key

        // Ignore or emit offending words based on their pattern.
        for (key in matches) {
          if (own.call(matches, key)) {
            const pattern = byId[key]
            handlers[
              pattern.type === 'or' && noBinary ? 'basic' : pattern.type
            ](matches[key], pattern, file)
          }
        }

        return SKIP

        // Handle a match.
        function handle(match, position, parent, phrase) {
          const index = list.indexOf(phrase)
          const pattern = byIndex[index]
          const id = pattern.id

          if (phrase !== phrase.toLowerCase() && toString(match) !== phrase) {
            return
          }

          if (!(id in matches)) {
            matches[id] = []
          }

          matches[id].push({
            type: pattern.inconsiderate[phrase],
            parent,
            nodes: match,
            start: position,
            end: position + match.length - 1
          })
        }
      })
    }
  }

  function unpack() {
    let index = -1

    while (++index < patterns.length) {
      const pattern = patterns[index]
      let phrase

      byId[pattern.id] = pattern

      for (phrase in pattern.inconsiderate) {
        if (own.call(pattern.inconsiderate, phrase)) {
          list.push(phrase)
          byIndex.push(pattern)
          if (pattern.apostrophe) apostrophes.push(phrase)
        }
      }
    }
  }

  // Handle matches for a `basic` pattern.
  // **Basic** patterns need no extra logic, every match is emitted as a
  // warning.
  function basic(matches, pattern, file) {
    let index = -1

    while (++index < matches.length) {
      warn(file, matches[index], pattern)
    }
  }

  // Handle matches for an **or** pattern.
  // **Or** patterns emit a warning unless every category is present.
  //
  // For example, when `him` and `her` occur adjacent to each other, they are not
  // warned about.
  // But when they occur alone, they are.
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
            whiteSpace(sibling) ||
            (word(sibling) && /(and|or)/.test(normalize(sibling))) ||
            (punctuation(sibling) && normalize(sibling) === '/')
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

  function warn(file, match, pattern) {
    const actual = toString(match.nodes)
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

    Object.assign(
      file.message(
        quotation(actual, '`') +
          ' may be insensitive' +
          (pattern.condition ? ', ' + pattern.condition : '') +
          ', ' +
          (expected
            ? 'use ' + quotation(expected, '`').join(', ') + ' instead'
            : 'try not to use it'),
        match.nodes[0],
        [source, pattern.id].join(':')
      ),
      {actual, expected, note: pattern.note}
    )
  }
}
