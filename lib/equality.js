/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:equality
 * @fileoverview Warn about possible insensitive, inconsiderate language
 *   with Retext.
 */

'use strict';

/*
 * Dependencies.
 */

var keys = require('object-keys');
var visit = require('unist-util-visit');
var nlcstToString = require('nlcst-to-string');
var isLiteral = require('nlcst-is-literal');
var patterns = require('./patterns.json');

/*
 * Internal mapping.
 */

var byId = {};
var byWord = {};

(function () {
    var index = -1;
    var length = patterns.length;
    var pattern;
    var inconsiderate;
    var id;
    var phrase;
    var firstWord;

    while (++index < length) {
        pattern = patterns[index];
        inconsiderate = pattern.inconsiderate;
        id = pattern.id;

        byId[id] = pattern;

        for (phrase in inconsiderate) {
            firstWord = phrase.split(' ')[0].toLowerCase();

            if (firstWord in byWord) {
                byWord[firstWord].push(id);
            } else {
                byWord[firstWord] = [id];
            }
        }
    }
})();

/**
 * Get the first key at which `value` lives in `context`.
 *
 * @todo Externalise.
 * @param {Object} object - Context to search in.
 * @param {*} value - Value to search for.
 * @return {string?} - First key at which `value` lives,
 *   when applicable.
 */
function byValue(object, value) {
    var key;

    for (key in object) {
        if (object[key] === value) {
            return key;
        }
    }

    /* istanbul ignore next */
    return null;
}

/**
 * Get a string value from a node.
 *
 * @param {NLCSTNode} node - NLCST node.
 * @return {string}
 */
function toString(node) {
    return nlcstToString(node).replace(/['’-]/g, '');
}

/**
 * Get the value of multiple nodes
 *
 * @param {Array.<NLCSTNode>} node - NLCST nodes.
 * @return {string}
 */
function valueOf(node) {
    return nlcstToString({
        'children': node
    });
}

/**
 * Check `expression` in `parent` at `position`,
 * where `expression` is list of words.
 *
 * @param {Array} phrase - List of words.
 * @param {NLCSTNode} parent - Parent node.
 * @param {number} position - Position in `parent` to
 *   check.
 * @return {Array.<NLCSTNode>?} - When matched to
 *   skip, because one word matched.
 */
function matches(phrase, parent, position) {
    var siblings = parent.children;
    var node = siblings[position];
    var queue = [node];
    var index = -1;
    var length;

    phrase = phrase.split(' ');
    length = phrase.length;

    while (++index < length) {
        /*
         * Check if this node matches.
         */

        if (!node || phrase[index] !== toString(node).toLowerCase()) {
            return null;
        }

        /*
         * Exit if this is the last node.
         */

        if (index === length - 1) {
            break;
        }

        /*
         * Find the next word.
         */

        while (++position < siblings.length) {
            node = siblings[position];
            queue.push(node);

            if (node.type === 'WordNode') {
                break;
            }

            if (node.type === 'WhiteSpaceNode') {
                continue;
            }

            return null;
        }
    }

    return queue;
}

/**
 * Check `expression` in `parent` at `position`.
 *
 * @param {Object} expression - Violation expression.
 * @param {NLCSTNode} parent - Parent node.
 * @param {number} position - Position in `parent` to
 *   check.
 * @return {Object?} - Result.
 */
function check(expression, parent, position) {
    var values = expression.inconsiderate;
    var phrase;
    var result;

    for (phrase in values) {
        result = matches(phrase, parent, position);

        if (result) {
            return {
                'end': position + result.length - 1,
                'category': values[phrase]
            };
        }
    }

    return null;
}

/**
 * Create a human readable warning message for `violation`
 * and suggest `suggestion`.
 *
 * @example
 *   message('one', 'two');
 *   // '`one` may be insensitive, use `two` instead'
 *
 *   message(['one', 'two'], 'three');
 *   // '`one`, `two` may be insensitive, use `three` instead'
 *
 *   message(['one', 'two'], 'three', '/');
 *   // '`one` / `two` may be insensitive, use `three` instead'
 *
 * @param {*} violation - One or more violations.
 * @param {*} suggestion - One or more suggestions.
 * @param {string} [joiner] - Joiner to use.
 * @return {string} - Human readable warning.
 */
function message(violation, suggestion, joiner) {
    return quote(violation, joiner) +
        ' may be insensitive, use ' +
        quote(suggestion, joiner) +
        ' instead';
}

/**
 * Quote text meant as literal.
 *
 * @example
 *   quote('one');
 *   // '`one`'
 *
 * @example
 *   quote(['one', 'two']);
 *   // '`one`, `two`'
 *
 * @example
 *   quote(['one', 'two'], '/');
 *   // '`one` / `two`'
 *
 * @param {string|Array.<string>} value - One or more
 *   violations.
 * @param {string} [joiner] - Joiner to use.
 * @return {string} - Quoted, joined `value`.
 */
function quote(value, joiner) {
    joiner = !joiner || joiner === ',' ? '`, `' : '` ' + joiner + ' `';

    return '`' + (value.join ? value.join(joiner) : value) + '`';
}

/**
 * Check whether the first character of a given value is
 * upper-case. Supports a string, or a list of strings.
 * Defers to the standard library for what defines
 * a “upper case” letter.
 *
 * @example
 *   isCapitalized('one'); // false
 *   isCapitalized('One'); // true
 *
 * @example
 *   isCapitalized(['one', 'Two']); // false
 *   isCapitalized(['One', 'two']); // true
 *
 * @param {string|Array.<string>} value - One, or a list
 *   of strings.
 * @return {boolean} - Whether the first character is
 *   upper-case.
 */
function isCapitalized(value) {
    var character = (value.charAt ? value : value[0]).charAt(0);

    return character.toUpperCase() === character;
}

/**
 * Capitalize a list of values.
 *
 * @example
 *   capitalize(['one', 'two']); // ['One', 'Two']
 *
 * @param {Array.<string>} value - List of values.
 * @return {Array.<string>} - Capitalized values.
 */
function capitalize(value) {
    var result = [];
    var index = -1;
    var length;

    length = value.length;

    while (++index < length) {
        result[index] = value[index].charAt(0).toUpperCase() +
            value[index].slice(1);
    }

    return result;
}

/**
 * Warn on `file` about `violation` (at `node`) with
 * `suggestion`s.
 *
 * @param {File} file - Virtual file.
 * @param {string|Array.<string>} violation - One or more
 *   violations.
 * @param {string|Array.<string>} suggestion - One or more
 *   suggestions.
 * @param {Node} node - Node which violates.
 * @param {string?} [note] - Extensive description.
 * @param {string?} [joiner] - Joiner of message.
 * @param {NLCSTNode} node - Node which violates.
 */
function warn(file, violation, suggestion, node, note, joiner) {
    var warning;

    if (!('join' in suggestion)) {
        suggestion = keys(suggestion);
    }

    if (isCapitalized(violation)) {
        suggestion = capitalize(suggestion);
    }

    warning = file.warn(message(violation, suggestion, joiner), node);

    if (note) {
        warning.note = note;
    }
}

/**
 * Test `epxression` on the node at `position` in
 * `parent`.
 *
 * @param {File} file - Virtual file.
 * @param {Object} expression - An expression mapping
 *   offenses to fixes.
 * @param {number} position - Index in `parent`
 * @param {Node} parent - Parent node.
 */
function test(file, expression, position, parent) {
    var result = check(expression, parent, position);

    if (result) {
        return {
            'id': expression.id,
            'type': result.category,
            'parent': parent,
            'start': position,
            'end': result.end
        };
    }

    return null;
}

/**
 * Handle matches for a `simple` pattern.  Simple-patterns
 * need no extra logic, every match is triggered as a
 * warning.
 *
 * @param {Array.<Object>} matches - List of matches
 *   matching `pattern` in a context.
 * @param {Object} pattern - Simple-pattern object.
 * @param {VFile} file - Virtual file.
 */
function simple(matches, pattern, file) {
    var length = matches.length;
    var index = -1;
    var match;
    var siblings;

    while (++index < length) {
        match = matches[index];
        siblings = match.parent.children;

        warn(file, valueOf(
            siblings.slice(match.start, match.end + 1)
        ), pattern.considerate, siblings[match.start], pattern.note);
    }
}

/**
 * Handle matches for an `and` pattern.  And-patterns
 * trigger a warning when every category is present.
 *
 * For example, when `master` and `slave` occur in a
 * context together, they trigger a warning.
 *
 * @param {Array.<Object>} matches - List of matches
 *   matching `pattern` in a context.
 * @param {Object} pattern - And-pattern object.
 * @param {VFile} file - Virtual file.
 */
function and(matches, pattern, file) {
    var categories = pattern.categories.concat();
    var length = matches.length;
    var index = -1;
    var phrases = [];
    var suggestions = [];
    var match;
    var position;
    var siblings;
    var first;

    while (++index < length) {
        match = matches[index];
        siblings = match.parent.children;
        position = categories.indexOf(match.type);

        if (position !== -1) {
            categories.splice(position, 1);
            phrases.push(valueOf(siblings.slice(match.start, match.end + 1)));
            suggestions.push(byValue(pattern.considerate, match.type));

            if (!first) {
                first = siblings[match.start];
            }

            if (categories.length === 0) {
                warn(file, phrases, suggestions, first, pattern.note, '/');
            }
        }
    }
}

/**
 * Handle matches for an `or` pattern.  Or-patterns
 * trigger a warning unless every category is present.
 *
 * For example, when `him` and `her` occur adjacent
 * to each other, they are not warned about. But when
 * they occur alone, they are.
 *
 * @param {Array.<Object>} matches - List of matches
 *   matching `pattern` in a context.
 * @param {Object} pattern - Or-pattern object.
 * @param {VFile} file - Virtual file.
 */
function or(matches, pattern, file) {
    var length = matches.length;
    var index = -1;
    var match;
    var next;
    var siblings;
    var sibling;
    var start;
    var end;

    while (++index < length) {
        match = matches[index];
        siblings = match.parent.children;
        next = matches[index + 1];

        if (
            next &&
            next.parent === match.parent &&
            next.type !== match.type
        ) {
            start = match.end;
            end = next.start;

            while (++start < end) {
                sibling = siblings[start];

                if (
                    sibling.type === 'WhiteSpaceNode' ||
                    (
                        sibling.type === 'WordNode' &&
                        /(and|or)/.test(toString(sibling))
                    )
                ) {
                    continue;
                }

                break;
            }

            /*
             * If we didn't break...
             */

            if (start === end) {
                index++;
                continue;
            }
        }

        warn(file, valueOf(
            siblings.slice(match.start, match.end + 1)
        ), pattern.considerate, siblings[match.start], pattern.note);
    }
}

/*
 * Dictionary of handled patterns.
 */

var handlers = {};

handlers.and = and;
handlers.or = or;
handlers.simple = simple;

/**
 * Factory to create a visitor which warns on `file`.
 *
 * @param {File} file - Virtual file.
 * @return {Function} - Paragraph visitor.
 */
function factory(file) {
    /**
     * Search `node` for violations.
     *
     * @param {NLCSTParagraphNode} node - Paragraph.
     */
    return function (node) {
        var matches = {};
        var id;
        var pattern;

        /*
         * Find offending words.
         */

        visit(node, 'WordNode', function (child, position, parent) {
            var value;
            var patterns;
            var length;
            var index;
            var result;

            if (isLiteral(parent, position)) {
                return;
            }

            value = toString(child).toLowerCase()
            patterns = byWord.hasOwnProperty(value) ? byWord[value] : null;
            length = patterns ? patterns.length : 0;
            index = -1;

            while (++index < length) {
                result = test(file, byId[patterns[index]], position, parent);

                if (result) {
                    if (result.id in matches) {
                        matches[result.id].push(result);
                    } else {
                        matches[result.id] = [result];
                    }
                }
            }
        });

        /*
         * Ignore or trigger offending words based on
         * their pattern.
         */

        for (id in matches) {
            pattern = byId[id];
            handlers[pattern.type](matches[id], pattern, file);
        }
    };
}

/**
 * Transformer.
 *
 * @param {NLCSTNode} cst - Syntax tree.
 */
function transformer(cst, file) {
    visit(cst, 'ParagraphNode', factory(file));
}

/**
 * Attacher.
 *
 * @return {Function} - `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
