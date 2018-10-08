'use strict'

module.exports = equality

var keys = require('object-keys')
var difference = require('lodash.difference')
var intersection = require('lodash.intersection')
var search = require('nlcst-search')
var visit = require('unist-util-visit')
var toString = require('nlcst-to-string')
var normalize = require('nlcst-normalize')
var quotation = require('quotation')
var patterns = require('./patterns.json')

/* Several pattern types can be handled.  Handlers are
 * stored in this map by type. */
var handlers = {and: and, or: or, simple: simple}

/* Internal mapping. */
var byId = []
var byIndex = []
var apostrophes = []
var list = []

/* Constants (types). */
var ws = 'WhiteSpaceNode'
var word = 'WordNode'
var punc = 'PunctuationNode'
var para = 'ParagraphNode'

var source = 'retext-equality'

/* Unpack. */
;(function() {
  var index = -1
  var length = patterns.length
  var pattern
  var inconsiderate
  var phrase
  var id

  while (++index < length) {
    pattern = patterns[index]
    inconsiderate = pattern.inconsiderate
    id = pattern.id

    byId[id] = pattern

    for (phrase in inconsiderate) {
      list.push(phrase)
      byIndex.push(pattern)

      if (pattern.apostrophe) {
        apostrophes.push(phrase)
      }
    }
  }
})()

/* Attacher. */
function equality(options) {
  var settings = options || {}
  var ignore = settings.ignore || []
  var noBinary = settings.noBinary
  var phrases = difference(list, ignore)
  var noNormalize = intersection(phrases, apostrophes)
  var normalize = difference(phrases, noNormalize)

  return transformer

  /* Transformer. */
  function transformer(cst, file) {
    visit(cst, para, visitor)

    function visitor(node) {
      var matches = {}
      var key
      var type

      search(node, normalize, handle)
      search(node, noNormalize, handle, true)

      /* Ignore or trigger offending words based on
       * their pattern. */
      for (key in matches) {
        type = byId[key].type

        if (type === 'or' && noBinary) {
          type = 'simple'
        }

        handlers[type](matches[key], byId[key], file)
      }

      /* Handle a match. */
      function handle(match, position, parent, phrase) {
        var index = list.indexOf(phrase)
        var pattern = byIndex[index]
        var id = pattern.id

        if (!(id in matches)) {
          matches[id] = []
        }

        matches[id].push({
          type: pattern.inconsiderate[phrase],
          parent: parent,
          nodes: match,
          start: position,
          end: position + match.length - 1
        })
      }
    }
  }
}

/* Handle matches for a `simple` pattern.  Simple-patterns
 * need no extra logic, every match is triggered as a
 * warning. */
function simple(matches, pattern, file) {
  var note = pattern.note
  var id = pattern.id
  var length = matches.length
  var index = -1
  var match
  var nodes

  while (++index < length) {
    match = matches[index]
    nodes = match.nodes

    warn(
      file,
      id,
      toString(nodes),
      pattern.considerate,
      nodes[0],
      note,
      pattern.condition
    )
  }
}

/* Handle matches for an `and` pattern.  And-patterns
 * trigger a warning when every category is present.
 *
 * For example, when `master` and `slave` occur in a
 * context together, they trigger a warning. */
function and(matches, pattern, file) {
  var categories = pattern.categories.concat()
  var note = pattern.note
  var id = pattern.id
  var length = matches.length
  var index = -1
  var phrases = []
  var suggestions = []
  var match
  var position
  var siblings
  var first

  while (++index < length) {
    match = matches[index]
    siblings = match.parent.children
    position = categories.indexOf(match.type)

    if (position !== -1) {
      categories.splice(position, 1)
      phrases.push(toString(siblings.slice(match.start, match.end + 1)))
      suggestions.push(byValue(pattern.considerate, match.type))

      if (!first) {
        first = match.nodes[0]
      }

      if (categories.length === 0) {
        warn(
          file,
          id,
          phrases,
          suggestions,
          first,
          note,
          pattern.condition,
          ' / '
        )
      }
    }
  }
}

/* Handle matches for an `or` pattern.  Or-patterns
 * trigger a warning unless every category is present.
 *
 * For example, when `him` and `her` occur adjacent
 * to each other, they are not warned about. But when
 * they occur alone, they are. */
function or(matches, pattern, file) {
  var length = matches.length
  var note = pattern.note
  var id = pattern.id
  var index = -1
  var match
  var next
  var siblings
  var sibling
  var value
  var nodes
  var start
  var end

  while (++index < length) {
    match = matches[index]
    siblings = match.parent.children
    nodes = match.nodes
    value = toString(nodes)
    next = matches[index + 1]

    if (next && next.parent === match.parent && next.type !== match.type) {
      start = match.end
      end = next.start

      while (++start < end) {
        sibling = siblings[start]

        if (
          sibling.type === ws ||
          (sibling.type === word && /(and|or)/.test(normalize(sibling))) ||
          (sibling.type === punc && normalize(sibling) === '/')
        ) {
          continue
        }

        break
      }

      /* If we didn't break... */
      if (start === end) {
        index++
        continue
      }
    }

    warn(
      file,
      id,
      value,
      pattern.considerate,
      nodes[0],
      note,
      pattern.condition
    )
  }
}

/* Warn on `file` about `violation` (at `node`) with
 * `suggestion`s. */
function warn(file, id, violation, suggestion, node, note, condition, joiner) {
  var warning

  if (!('join' in suggestion)) {
    suggestion = keys(suggestion)
  }

  if (isCapitalized(violation)) {
    suggestion = capitalize(suggestion)
  }

  warning = message(violation, suggestion, condition, joiner)
  warning = file.warn(warning, node, [source, id].join(':'))

  if (note) {
    warning.note = note
  }
}

/* Get the first key at which `value` lives in `context`. */
function byValue(object, value) {
  var key

  for (key in object) {
    if (object[key] === value) {
      return key
    }
  }

  /* istanbul ignore next */
  return null
}

/* Join `value`, if joinable, with `joiner` or `', '`. */
function join(value, joiner) {
  return typeof value === 'string' ? value : value.join(joiner || ', ')
}

/* Create a human readable warning message for `violation`
 * and suggest `suggestion`. */
function message(violation, suggestion, condition, joiner) {
  return (
    join(quotation(violation, '`'), joiner) +
    ' may be insensitive' +
    (condition ? ', ' + condition : '') +
    ', use ' +
    join(quotation(suggestion, '`'), joiner) +
    ' instead'
  )
}

/* Check whether the first character of a given value is
 * upper-case. Supports a string, or a list of strings.
 * Defers to the standard library for what defines
 * a “upper case” letter. */
function isCapitalized(value) {
  var char = (value.charAt ? value : value[0]).charAt(0)
  return char.toUpperCase() === char
}

/* Capitalize a list of values. */
function capitalize(value) {
  var result = []
  var index = -1
  var length = value.length

  while (++index < length) {
    result[index] = value[index].charAt(0).toUpperCase() + value[index].slice(1)
  }

  return result
}
