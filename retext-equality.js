(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextEquality = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('./lib/equality.js');

},{"./lib/equality.js":2}],2:[function(require,module,exports){
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
 * @param {NLCSTNode} node - Node which violates.
 */
function warn(file, violation, suggestion, node, joiner) {
    if (!('join' in suggestion)) {
        suggestion = keys(suggestion);
    }

    if (isCapitalized(violation)) {
        suggestion = capitalize(suggestion);
    }

    file.warn(message(violation, suggestion, joiner), node);
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
        ), pattern.considerate, siblings[match.start]);
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
                warn(file, phrases, suggestions, first, '/');
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
        ), pattern.considerate, siblings[match.start]);
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

},{"./patterns.json":3,"nlcst-is-literal":4,"nlcst-to-string":5,"object-keys":6,"unist-util-visit":8}],3:[function(require,module,exports){
module.exports=[
  {
    "type": "or",
    "considerate": {
      "their": "a",
      "theirs": "a",
      "them": "a"
    },
    "inconsiderate": {
      "her": "female",
      "hers": "female",
      "him": "male",
      "his": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 0
  },
  {
    "type": "or",
    "considerate": {
      "they": "a",
      "it": "a"
    },
    "inconsiderate": {
      "she": "female",
      "he": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 1
  },
  {
    "type": "or",
    "considerate": {
      "themselves": "a",
      "theirself": "a",
      "self": "a"
    },
    "inconsiderate": {
      "herself": "female",
      "himself": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 2
  },
  {
    "type": "or",
    "considerate": {
      "kid": "a",
      "child": "a"
    },
    "inconsiderate": {
      "girl": "female",
      "boy": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 3
  },
  {
    "type": "or",
    "considerate": {
      "people": "a",
      "persons": "a",
      "folks": "a"
    },
    "inconsiderate": {
      "women": "female",
      "girls": "female",
      "gals": "female",
      "ladies": "female",
      "men": "male",
      "guys": "male",
      "dudes": "male",
      "gents": "male",
      "gentlemen": "male",
      "mankind": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 4
  },
  {
    "type": "or",
    "considerate": {
      "person": "a",
      "friend": "a",
      "pal": "a",
      "folk": "a",
      "individual": "a"
    },
    "inconsiderate": {
      "woman": "female",
      "gal": "female",
      "lady": "female",
      "babe": "female",
      "bimbo": "female",
      "chick": "female",
      "guy": "male",
      "lad": "male",
      "fellow": "male",
      "dude": "male",
      "bro": "male",
      "gentleman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 5
  },
  {
    "type": "or",
    "considerate": {
      "native land": "a"
    },
    "inconsiderate": {
      "motherland": "female",
      "fatherland": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 6
  },
  {
    "type": "or",
    "considerate": {
      "native tongue": "a",
      "native language": "a"
    },
    "inconsiderate": {
      "mother tongue": "female",
      "father tongue": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 7
  },
  {
    "type": "or",
    "considerate": {
      "first-year students": "a",
      "freshers": "a"
    },
    "inconsiderate": {
      "freshwomen": "female",
      "freshmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 8
  },
  {
    "type": "or",
    "considerate": {
      "garbage collector": "a",
      "waste collector": "a",
      "trash collector": "a"
    },
    "inconsiderate": {
      "garbagewoman": "female",
      "garbageman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 9
  },
  {
    "type": "or",
    "considerate": {
      "garbage collectors": "a",
      "waste collectors": "a",
      "trash collectors": "a"
    },
    "inconsiderate": {
      "garbagewomen": "female",
      "garbagemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 10
  },
  {
    "type": "or",
    "considerate": {
      "chair": "a",
      "chairperson": "a",
      "coordinator": "a"
    },
    "inconsiderate": {
      "chairwoman": "female",
      "chairman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 11
  },
  {
    "type": "or",
    "considerate": {
      "committee member": "a"
    },
    "inconsiderate": {
      "committee woman": "female",
      "committee man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 12
  },
  {
    "type": "or",
    "considerate": {
      "cowhand": "a"
    },
    "inconsiderate": {
      "cowgirl": "female",
      "cowboy": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 13
  },
  {
    "type": "or",
    "considerate": {
      "cowhands": "a"
    },
    "inconsiderate": {
      "cowgirls": "female",
      "cowboys": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 14
  },
  {
    "type": "or",
    "considerate": {
      "cattle rancher": "a"
    },
    "inconsiderate": {
      "cattlewoman": "female",
      "cattleman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 15
  },
  {
    "type": "or",
    "considerate": {
      "cattle ranchers": "a"
    },
    "inconsiderate": {
      "cattlewomen": "female",
      "cattlemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 16
  },
  {
    "type": "or",
    "considerate": {
      "chairs": "a",
      "chairpersons": "a",
      "coordinators": "a"
    },
    "inconsiderate": {
      "chairwomen": "female",
      "chairmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 17
  },
  {
    "type": "or",
    "considerate": {
      "mail carrier": "a",
      "letter carrier": "a",
      "postal worker": "a"
    },
    "inconsiderate": {
      "postwoman": "female",
      "mailwoman": "female",
      "postman": "male",
      "mailman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 18
  },
  {
    "type": "or",
    "considerate": {
      "mail carriers": "a",
      "letter carriers": "a",
      "postal workers": "a"
    },
    "inconsiderate": {
      "postwomen": "female",
      "mailwomen": "female",
      "postmen": "male",
      "mailmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 19
  },
  {
    "type": "or",
    "considerate": {
      "officer": "a",
      "police officer": "a"
    },
    "inconsiderate": {
      "policewoman": "female",
      "policeman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 20
  },
  {
    "type": "or",
    "considerate": {
      "officers": "a",
      "police officers": "a"
    },
    "inconsiderate": {
      "policewomen": "female",
      "policemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 21
  },
  {
    "type": "or",
    "considerate": {
      "flight attendant": "a"
    },
    "inconsiderate": {
      "stewardess": "female",
      "steward": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 22
  },
  {
    "type": "or",
    "considerate": {
      "flight attendants": "a"
    },
    "inconsiderate": {
      "stewardesses": "female",
      "stewards": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 23
  },
  {
    "type": "or",
    "considerate": {
      "member of congress": "a",
      "congress person": "a",
      "legislator": "a",
      "representative": "a"
    },
    "inconsiderate": {
      "congresswoman": "female",
      "congressman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 24
  },
  {
    "type": "or",
    "considerate": {
      "member of congresss": "a",
      "congress persons": "a",
      "legislators": "a",
      "representatives": "a"
    },
    "inconsiderate": {
      "congresswomen": "female",
      "congressmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 25
  },
  {
    "type": "or",
    "considerate": {
      "fire fighter": "a"
    },
    "inconsiderate": {
      "firewoman": "female",
      "fireman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 26
  },
  {
    "type": "or",
    "considerate": {
      "fire fighters": "a"
    },
    "inconsiderate": {
      "firewomen": "female",
      "firemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 27
  },
  {
    "type": "or",
    "considerate": {
      "fisher": "a",
      "crew member": "a"
    },
    "inconsiderate": {
      "fisherwoman": "female",
      "fisherman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 28
  },
  {
    "type": "or",
    "considerate": {
      "fishers": "a"
    },
    "inconsiderate": {
      "fisherwomen": "female",
      "fishermen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 29
  },
  {
    "type": "or",
    "considerate": {
      "kinship": "a",
      "community": "a"
    },
    "inconsiderate": {
      "sisterhood": "female",
      "brotherhood": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 30
  },
  {
    "type": "or",
    "considerate": {
      "common person": "a",
      "average person": "a"
    },
    "inconsiderate": {
      "common girl": "female",
      "common man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 31
  },
  {
    "type": "or",
    "considerate": {
      "business executive": "a",
      "entrepreneur": "a",
      "business person": "a",
      "professional": "a"
    },
    "inconsiderate": {
      "businesswoman": "female",
      "salarywoman": "female",
      "businessman": "male",
      "salaryman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 32
  },
  {
    "type": "or",
    "considerate": {
      "business executives": "a",
      "entrepreneurs": "a"
    },
    "inconsiderate": {
      "businesswomen": "female",
      "salarywomen": "female",
      "career girl": "female",
      "career woman": "female",
      "businessmen": "male",
      "salarymen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 33
  },
  {
    "type": "or",
    "considerate": {
      "cleaner": "a"
    },
    "inconsiderate": {
      "cleaning lady": "female",
      "cleaning girl": "female",
      "cleaning woman": "female",
      "janitress": "female",
      "cleaning man": "male",
      "cleaning boy": "male",
      "janitor": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 34
  },
  {
    "type": "or",
    "considerate": {
      "cleaners": "a"
    },
    "inconsiderate": {
      "cleaning ladies": "female",
      "cleaning girls": "female",
      "janitresses": "female",
      "cleaning men": "male",
      "janitors": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 35
  },
  {
    "type": "or",
    "considerate": {
      "courier": "a",
      "messenger": "a"
    },
    "inconsiderate": {
      "delivery girl": "female",
      "delivery boy": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 36
  },
  {
    "type": "or",
    "considerate": {
      "supervisor": "a",
      "shift boss": "a"
    },
    "inconsiderate": {
      "forewoman": "female",
      "foreman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 37
  },
  {
    "type": "or",
    "considerate": {
      "lead": "a",
      "front": "a",
      "figurehead": "a"
    },
    "inconsiderate": {
      "frontwoman, front woman": "female",
      "frontman, front man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 38
  },
  {
    "type": "or",
    "considerate": {
      "figureheads": "a"
    },
    "inconsiderate": {
      "front women, frontwomen": "female",
      "front men, frontmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 39
  },
  {
    "type": "or",
    "considerate": {
      "supervisors": "a",
      "shift bosses": "a"
    },
    "inconsiderate": {
      "forewomen": "female",
      "foremen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 40
  },
  {
    "type": "or",
    "considerate": {
      "insurance agent": "a"
    },
    "inconsiderate": {
      "insurance woman": "female",
      "insurance man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 41
  },
  {
    "type": "or",
    "considerate": {
      "insurance agents": "a"
    },
    "inconsiderate": {
      "insurance women": "female",
      "insurance men": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 42
  },
  {
    "type": "or",
    "considerate": {
      "proprietor": "a",
      "building manager": "a"
    },
    "inconsiderate": {
      "landlady": "female",
      "landlord": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 43
  },
  {
    "type": "or",
    "considerate": {
      "proprietors": "a",
      "building managers": "a"
    },
    "inconsiderate": {
      "landladies": "female",
      "landlords": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 44
  },
  {
    "type": "or",
    "considerate": {
      "graduate": "a"
    },
    "inconsiderate": {
      "alumna": "female",
      "alumnus": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 45
  },
  {
    "type": "or",
    "considerate": {
      "graduates": "a"
    },
    "inconsiderate": {
      "alumnae": "female",
      "alumni": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 46
  },
  {
    "type": "or",
    "considerate": {
      "anchor": "a",
      "journalist": "a"
    },
    "inconsiderate": {
      "newswoman": "female",
      "newspaperwoman": "female",
      "anchorwoman": "female",
      "newsman": "male",
      "newspaperman": "male",
      "anchorman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 47
  },
  {
    "type": "or",
    "considerate": {
      "anchors": "a",
      "journalists": "a"
    },
    "inconsiderate": {
      "newswomen": "female",
      "newspaperwomen": "female",
      "anchorwomen": "female",
      "newsmen": "male",
      "newspapermen": "male",
      "anchormen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 48
  },
  {
    "type": "or",
    "considerate": {
      "repairer": "a",
      "technician": "a"
    },
    "inconsiderate": {
      "repairwoman": "female",
      "repairman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 49
  },
  {
    "type": "or",
    "considerate": {
      "technicians": "a"
    },
    "inconsiderate": {
      "repairwomen": "female",
      "repairmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 50
  },
  {
    "type": "or",
    "considerate": {
      "salesperson": "a",
      "sales clerk": "a",
      "sales rep": "a",
      "sales agent": "a",
      "seller": "a"
    },
    "inconsiderate": {
      "saleswoman": "female",
      "sales woman": "female",
      "saleslady": "female",
      "salesman": "male",
      "sales man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 51
  },
  {
    "type": "or",
    "considerate": {
      "sales clerks": "a",
      "sales reps": "a",
      "sales agents": "a",
      "sellers": "a"
    },
    "inconsiderate": {
      "saleswomen": "female",
      "sales women": "female",
      "salesladies": "female",
      "salesmen": "male",
      "sales men": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 52
  },
  {
    "type": "or",
    "considerate": {
      "soldier": "a",
      "service representative": "a"
    },
    "inconsiderate": {
      "servicewoman": "female",
      "serviceman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 53
  },
  {
    "type": "or",
    "considerate": {
      "soldiers": "a",
      "service representatives": "a"
    },
    "inconsiderate": {
      "servicewomen": "female",
      "servicemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 54
  },
  {
    "type": "or",
    "considerate": {
      "server": "a"
    },
    "inconsiderate": {
      "waitress": "female",
      "waiter": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 55
  },
  {
    "type": "or",
    "considerate": {
      "servers": "a"
    },
    "inconsiderate": {
      "waitresses": "female",
      "waiters": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 56
  },
  {
    "type": "or",
    "considerate": {
      "worker": "a",
      "wage earner": "a",
      "taxpayer": "a"
    },
    "inconsiderate": {
      "workwoman": "female",
      "working woman": "female",
      "workman": "male",
      "working man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 57
  },
  {
    "type": "or",
    "considerate": {
      "workers": "a"
    },
    "inconsiderate": {
      "workwomen": "female",
      "workmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 58
  },
  {
    "type": "or",
    "considerate": {
      "performer": "a",
      "star": "a",
      "artist": "a"
    },
    "inconsiderate": {
      "actress": "female",
      "actor": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 59
  },
  {
    "type": "or",
    "considerate": {
      "performers": "a",
      "stars": "a",
      "artists": "a"
    },
    "inconsiderate": {
      "actresses": "female",
      "actors": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 60
  },
  {
    "type": "or",
    "considerate": {
      "pilot": "a",
      "aviator": "a",
      "airstaff": "a"
    },
    "inconsiderate": {
      "aircrewwoman": "female",
      "aircrew woman": "female",
      "aircrewman": "male",
      "airman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 61
  },
  {
    "type": "or",
    "considerate": {
      "pilots": "a",
      "aviators": "a",
      "airstaff": "a"
    },
    "inconsiderate": {
      "aircrewwomen": "female",
      "aircrew women": "female",
      "aircrewmen": "male",
      "airmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 62
  },
  {
    "type": "or",
    "considerate": {
      "cabinet member": "a"
    },
    "inconsiderate": {
      "alderwoman": "female",
      "alderman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 63
  },
  {
    "type": "or",
    "considerate": {
      "cabinet": "a",
      "cabinet members": "a"
    },
    "inconsiderate": {
      "alderwomen": "female",
      "aldermen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 64
  },
  {
    "type": "or",
    "considerate": {
      "assembly person": "a",
      "assembly worker": "a"
    },
    "inconsiderate": {
      "assemblywoman": "female",
      "assemblyman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 65
  },
  {
    "type": "or",
    "considerate": {
      "relative": "a"
    },
    "inconsiderate": {
      "kinswoman": "female",
      "aunt": "female",
      "kinsman": "male",
      "uncle": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 66
  },
  {
    "type": "or",
    "considerate": {
      "relatives": "a"
    },
    "inconsiderate": {
      "kinswomen": "female",
      "aunts": "female",
      "kinsmen": "male",
      "uncles": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 67
  },
  {
    "type": "or",
    "considerate": {
      "klansperson": "a"
    },
    "inconsiderate": {
      "klanswoman": "female",
      "klansman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 68
  },
  {
    "type": "or",
    "considerate": {
      "clansperson": "a",
      "clan member": "a"
    },
    "inconsiderate": {
      "clanswoman": "female",
      "clansman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 69
  },
  {
    "type": "or",
    "considerate": {
      "klan": "a",
      "klanspersons": "a"
    },
    "inconsiderate": {
      "klanswomen": "female",
      "klansmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 70
  },
  {
    "type": "or",
    "considerate": {
      "boogey": "a"
    },
    "inconsiderate": {
      "boogeywoman": "female",
      "boogeyman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 71
  },
  {
    "type": "or",
    "considerate": {
      "boogie": "a"
    },
    "inconsiderate": {
      "boogiewoman": "female",
      "boogieman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 72
  },
  {
    "type": "or",
    "considerate": {
      "bogey": "a"
    },
    "inconsiderate": {
      "bogeywoman": "female",
      "bogeyman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 73
  },
  {
    "type": "or",
    "considerate": {
      "bogie": "a"
    },
    "inconsiderate": {
      "bogiewoman": "female",
      "bogieman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 74
  },
  {
    "type": "or",
    "considerate": {
      "boogies": "a"
    },
    "inconsiderate": {
      "boogiewomen": "female",
      "boogiemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 75
  },
  {
    "type": "or",
    "considerate": {
      "bogies": "a"
    },
    "inconsiderate": {
      "bogiewomen": "female",
      "bogiemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 76
  },
  {
    "type": "or",
    "considerate": {
      "bonder": "a"
    },
    "inconsiderate": {
      "bondswoman": "female",
      "bondsman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 77
  },
  {
    "type": "or",
    "considerate": {
      "bonders": "a"
    },
    "inconsiderate": {
      "bondswomen": "female",
      "bondsmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 78
  },
  {
    "type": "or",
    "considerate": {
      "partner": "a",
      "significant other": "a",
      "spouse": "a"
    },
    "inconsiderate": {
      "wife": "female",
      "husband": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 79
  },
  {
    "type": "or",
    "considerate": {
      "partners": "a",
      "significant others": "a",
      "spouses": "a"
    },
    "inconsiderate": {
      "wives": "female",
      "husbands": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 80
  },
  {
    "type": "or",
    "considerate": {
      "partner": "a",
      "friend": "a",
      "significant other": "a"
    },
    "inconsiderate": {
      "girlfriend": "female",
      "boyfriend": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 81
  },
  {
    "type": "or",
    "considerate": {
      "partners": "a",
      "friends": "a",
      "significant others": "a"
    },
    "inconsiderate": {
      "girlfriends": "female",
      "boyfriends": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 82
  },
  {
    "type": "or",
    "considerate": {
      "childhood": "a"
    },
    "inconsiderate": {
      "girlhood": "female",
      "boyhood": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 83
  },
  {
    "type": "or",
    "considerate": {
      "childish": "a"
    },
    "inconsiderate": {
      "girly": "female",
      "girlish": "female",
      "boyish": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 84
  },
  {
    "type": "or",
    "considerate": {
      "traveler": "a"
    },
    "inconsiderate": {
      "journeywoman": "female",
      "journeyman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 85
  },
  {
    "type": "or",
    "considerate": {
      "travelers": "a"
    },
    "inconsiderate": {
      "journeywomen": "female",
      "journeymen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 86
  },
  {
    "type": "or",
    "considerate": {
      "godparent": "a",
      "elder": "a",
      "patron": "a"
    },
    "inconsiderate": {
      "godmother": "female",
      "patroness": "female",
      "godfather": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 87
  },
  {
    "type": "or",
    "considerate": {
      "grandchild": "a"
    },
    "inconsiderate": {
      "granddaughter": "female",
      "grandson": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 88
  },
  {
    "type": "or",
    "considerate": {
      "grandchildred": "a"
    },
    "inconsiderate": {
      "granddaughters": "female",
      "grandsons": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 89
  },
  {
    "type": "or",
    "considerate": {
      "ancestor": "a"
    },
    "inconsiderate": {
      "foremother": "female",
      "forefather": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 90
  },
  {
    "type": "or",
    "considerate": {
      "ancestors": "a"
    },
    "inconsiderate": {
      "foremothers": "female",
      "forefathers": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 91
  },
  {
    "type": "or",
    "considerate": {
      "grandparent": "a",
      "ancestor": "a"
    },
    "inconsiderate": {
      "granny": "female",
      "grandma": "female",
      "grandmother": "female",
      "grandpappy": "male",
      "granddaddy": "male",
      "gramps": "male",
      "grandpa": "male",
      "grandfather": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 92
  },
  {
    "type": "or",
    "considerate": {
      "grandparents": "a",
      "ancestors": "a"
    },
    "inconsiderate": {
      "grandmothers": "female",
      "grandfathers": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 93
  },
  {
    "type": "or",
    "considerate": {
      "spouse": "a"
    },
    "inconsiderate": {
      "bride": "female",
      "groom": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 94
  },
  {
    "type": "or",
    "considerate": {
      "sibling": "a"
    },
    "inconsiderate": {
      "sister": "female",
      "brother": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 95
  },
  {
    "type": "or",
    "considerate": {
      "siblings": "a"
    },
    "inconsiderate": {
      "sisters": "female",
      "brothers": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 96
  },
  {
    "type": "or",
    "considerate": {
      "camera operator": "a",
      "camera person": "a"
    },
    "inconsiderate": {
      "camerawoman": "female",
      "cameraman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 97
  },
  {
    "type": "or",
    "considerate": {
      "camera operators": "a"
    },
    "inconsiderate": {
      "camerawomen": "female",
      "cameramen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 98
  },
  {
    "type": "or",
    "considerate": {
      "troglodyte": "a",
      "hominidae": "a"
    },
    "inconsiderate": {
      "cavewoman": "female",
      "caveman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 99
  },
  {
    "type": "or",
    "considerate": {
      "troglodytae": "a",
      "troglodyti": "a",
      "troglodytes": "a",
      "hominids": "a"
    },
    "inconsiderate": {
      "cavewomen": "female",
      "cavemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 100
  },
  {
    "type": "or",
    "considerate": {
      "clergyperson": "a",
      "clergy": "a",
      "cleric": "a"
    },
    "inconsiderate": {
      "clergywomen": "female",
      "clergyman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 101
  },
  {
    "type": "or",
    "considerate": {
      "clergies": "a",
      "clerics": "a"
    },
    "inconsiderate": {
      "clergywomen": "female",
      "clergymen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 102
  },
  {
    "type": "or",
    "considerate": {
      "council member": "a"
    },
    "inconsiderate": {
      "councilwoman": "female",
      "councilman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 103
  },
  {
    "type": "or",
    "considerate": {
      "council members": "a"
    },
    "inconsiderate": {
      "councilwomen": "female",
      "councilmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 104
  },
  {
    "type": "or",
    "considerate": {
      "country person": "a"
    },
    "inconsiderate": {
      "countrywoman": "female",
      "countryman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 105
  },
  {
    "type": "or",
    "considerate": {
      "country folk": "a"
    },
    "inconsiderate": {
      "countrywomen": "female",
      "countrymen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 106
  },
  {
    "type": "or",
    "considerate": {
      "artisan": "a",
      "craftsperson": "a",
      "skilled worker": "a"
    },
    "inconsiderate": {
      "handywoman": "female",
      "craftswoman": "female",
      "handyman": "male",
      "craftsman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 107
  },
  {
    "type": "or",
    "considerate": {
      "presenter": "a"
    },
    "inconsiderate": {
      "hostess": "female",
      "host": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 108
  },
  {
    "type": "or",
    "considerate": {
      "presenters": "a"
    },
    "inconsiderate": {
      "hostesses": "female",
      "hosts": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 109
  },
  {
    "type": "or",
    "considerate": {
      "artisans": "a",
      "craftspersons": "a",
      "skilled workers": "a"
    },
    "inconsiderate": {
      "handywomen": "female",
      "craftswomen": "female",
      "handymen": "male",
      "craftsmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 110
  },
  {
    "type": "or",
    "considerate": {
      "guillotine": "a"
    },
    "inconsiderate": {
      "hangwoman": "female",
      "hangman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 111
  },
  {
    "type": "or",
    "considerate": {
      "guillotines": "a"
    },
    "inconsiderate": {
      "hangwomen": "female",
      "hangmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 112
  },
  {
    "type": "or",
    "considerate": {
      "sidekick": "a"
    },
    "inconsiderate": {
      "henchwoman": "female",
      "henchman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 113
  },
  {
    "type": "or",
    "considerate": {
      "sidekicks": "a"
    },
    "inconsiderate": {
      "henchwomen": "female",
      "henchmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 114
  },
  {
    "type": "or",
    "considerate": {
      "role-model": "a"
    },
    "inconsiderate": {
      "heroine": "female",
      "hero": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 115
  },
  {
    "type": "or",
    "considerate": {
      "role-models": "a"
    },
    "inconsiderate": {
      "heroines": "female",
      "heroes": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 116
  },
  {
    "type": "or",
    "considerate": {
      "parental": "a",
      "warm": "a",
      "intimate": "a"
    },
    "inconsiderate": {
      "maternal": "female",
      "paternal": "male",
      "fraternal": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 117
  },
  {
    "type": "or",
    "considerate": {
      "parental": "a"
    },
    "inconsiderate": {
      "maternity": "female",
      "paternity": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 118
  },
  {
    "type": "or",
    "considerate": {
      "parents": "a"
    },
    "inconsiderate": {
      "mamas": "female",
      "mothers": "female",
      "moms": "female",
      "mums": "female",
      "mommas": "female",
      "mommies": "female",
      "papas": "male",
      "fathers": "male",
      "dads": "male",
      "daddies": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 119
  },
  {
    "type": "or",
    "considerate": {
      "parent": "a"
    },
    "inconsiderate": {
      "mama": "female",
      "mother": "female",
      "mom": "female",
      "mum": "female",
      "momma": "female",
      "mommy": "female",
      "papa": "male",
      "father": "male",
      "dad": "male",
      "pop": "male",
      "daddy": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 120
  },
  {
    "type": "or",
    "considerate": {
      "child": "a"
    },
    "inconsiderate": {
      "daughter": "female",
      "son": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 121
  },
  {
    "type": "or",
    "considerate": {
      "children": "a"
    },
    "inconsiderate": {
      "daughters": "female",
      "sons": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 122
  },
  {
    "type": "or",
    "considerate": {
      "convierge": "a"
    },
    "inconsiderate": {
      "doorwoman": "female",
      "doorman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 123
  },
  {
    "type": "or",
    "considerate": {
      "convierges": "a"
    },
    "inconsiderate": {
      "doorwomen": "female",
      "doormen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 124
  },
  {
    "type": "or",
    "considerate": {
      "humanly": "a",
      "mature": "a"
    },
    "inconsiderate": {
      "feminin": "female",
      "dudely": "male",
      "manly": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 125
  },
  {
    "type": "or",
    "considerate": {
      "humans": "a"
    },
    "inconsiderate": {
      "females": "female",
      "males": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 126
  },
  {
    "type": "or",
    "considerate": {
      "ruler": "a"
    },
    "inconsiderate": {
      "empress": "female",
      "queen": "female",
      "emperor": "male",
      "king": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 127
  },
  {
    "type": "or",
    "considerate": {
      "rulers": "a"
    },
    "inconsiderate": {
      "empresses": "female",
      "queens": "female",
      "emperors": "male",
      "kings": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 128
  },
  {
    "type": "or",
    "considerate": {
      "jumbo": "a",
      "gigantic": "a"
    },
    "inconsiderate": {
      "queen-size": "female",
      "king-size": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 129
  },
  {
    "type": "or",
    "considerate": {
      "power behind the throne": "a"
    },
    "inconsiderate": {
      "queenmaker": "female",
      "kingmaker": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 130
  },
  {
    "type": "or",
    "considerate": {
      "civilian": "a"
    },
    "inconsiderate": {
      "laywoman": "female",
      "layman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 131
  },
  {
    "type": "or",
    "considerate": {
      "civilians": "a"
    },
    "inconsiderate": {
      "laywomen": "female",
      "laymen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 132
  },
  {
    "type": "or",
    "considerate": {
      "official": "a",
      "owner": "a",
      "expert": "a",
      "superior": "a",
      "chief": "a",
      "ruler": "a"
    },
    "inconsiderate": {
      "dame": "female",
      "lord": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 133
  },
  {
    "type": "or",
    "considerate": {
      "officials": "a",
      "masters": "a",
      "chiefs": "a",
      "rulers": "a"
    },
    "inconsiderate": {
      "dames": "female",
      "lords": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 134
  },
  {
    "type": "or",
    "considerate": {
      "adulthood": "a",
      "personhood": "a"
    },
    "inconsiderate": {
      "girlhood": "female",
      "masculinity": "male",
      "manhood": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 135
  },
  {
    "type": "or",
    "considerate": {
      "humanity": "a"
    },
    "inconsiderate": {
      "femininity": "female",
      "manliness": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 136
  },
  {
    "type": "or",
    "considerate": {
      "shooter": "a"
    },
    "inconsiderate": {
      "markswoman": "female",
      "marksman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 137
  },
  {
    "type": "or",
    "considerate": {
      "shooters": "a"
    },
    "inconsiderate": {
      "markswomen": "female",
      "marksmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 138
  },
  {
    "type": "or",
    "considerate": {
      "intermediary": "a",
      "go-between": "a"
    },
    "inconsiderate": {
      "middlewoman": "female",
      "middleman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 139
  },
  {
    "type": "or",
    "considerate": {
      "intermediaries": "a",
      "go-betweens": "a"
    },
    "inconsiderate": {
      "middlewomen": "female",
      "middlemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 140
  },
  {
    "type": "or",
    "considerate": {
      "milk person": "a"
    },
    "inconsiderate": {
      "milkwoman": "female",
      "milkman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 141
  },
  {
    "type": "or",
    "considerate": {
      "milk people": "a"
    },
    "inconsiderate": {
      "milkwomen": "female",
      "milkmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 142
  },
  {
    "type": "or",
    "considerate": {
      "nibling": "a",
      "sibling’s child": "a"
    },
    "inconsiderate": {
      "niece": "female",
      "nephew": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 143
  },
  {
    "type": "or",
    "considerate": {
      "niblings": "a",
      "sibling’s children": "a"
    },
    "inconsiderate": {
      "nieces": "female",
      "nephews": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 144
  },
  {
    "type": "or",
    "considerate": {
      "noble": "a"
    },
    "inconsiderate": {
      "noblewoman": "female",
      "nobleman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 145
  },
  {
    "type": "or",
    "considerate": {
      "nobles": "a"
    },
    "inconsiderate": {
      "noblewomen": "female",
      "noblemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 146
  },
  {
    "type": "or",
    "considerate": {
      "notary": "a",
      "consumer advocate": "a",
      "trouble shooter": "a"
    },
    "inconsiderate": {
      "ombudswoman": "female",
      "ombudsman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 147
  },
  {
    "type": "or",
    "considerate": {
      "notaries": "a"
    },
    "inconsiderate": {
      "ombudswomen": "female",
      "ombudsmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 148
  },
  {
    "type": "or",
    "considerate": {
      "heir": "a"
    },
    "inconsiderate": {
      "princess": "female",
      "prince": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 149
  },
  {
    "type": "or",
    "considerate": {
      "heirs": "a"
    },
    "inconsiderate": {
      "princesses": "female",
      "princes": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 150
  },
  {
    "type": "or",
    "considerate": {
      "fairy": "a"
    },
    "inconsiderate": {
      "sandwoman": "female",
      "sandman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 151
  },
  {
    "type": "or",
    "considerate": {
      "fairies": "a"
    },
    "inconsiderate": {
      "sandwomen": "female",
      "sandmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 152
  },
  {
    "type": "or",
    "considerate": {
      "promoter": "a"
    },
    "inconsiderate": {
      "showwoman": "female",
      "showman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 153
  },
  {
    "type": "or",
    "considerate": {
      "promoters": "a"
    },
    "inconsiderate": {
      "showwomen": "female",
      "show women": "female",
      "showmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 154
  },
  {
    "type": "or",
    "considerate": {
      "astronaut": "a"
    },
    "inconsiderate": {
      "spacewoman": "female",
      "spaceman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 155
  },
  {
    "type": "or",
    "considerate": {
      "astronauts": "a"
    },
    "inconsiderate": {
      "spacewomen": "female",
      "spacemen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 156
  },
  {
    "type": "or",
    "considerate": {
      "speaker": "a",
      "spokesperson": "a",
      "representative": "a"
    },
    "inconsiderate": {
      "spokeswoman": "female",
      "spokesman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 157
  },
  {
    "type": "or",
    "considerate": {
      "speakers": "a",
      "spokespersons": "a"
    },
    "inconsiderate": {
      "spokeswomen": "female",
      "spokesmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 158
  },
  {
    "type": "or",
    "considerate": {
      "athlete": "a",
      "sports person": "a"
    },
    "inconsiderate": {
      "sportswoman": "female",
      "sportsman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 159
  },
  {
    "type": "or",
    "considerate": {
      "athletes": "a",
      "sports persons": "a"
    },
    "inconsiderate": {
      "sportswomen": "female",
      "sportsmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 160
  },
  {
    "type": "or",
    "considerate": {
      "senator": "a"
    },
    "inconsiderate": {
      "stateswoman": "female",
      "statesman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 161
  },
  {
    "type": "or",
    "considerate": {
      "step-sibling": "a"
    },
    "inconsiderate": {
      "stepsister": "female",
      "stepbrother": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 162
  },
  {
    "type": "or",
    "considerate": {
      "step-siblings": "a"
    },
    "inconsiderate": {
      "stepsisters": "female",
      "stepbrothers": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 163
  },
  {
    "type": "or",
    "considerate": {
      "step-parent": "a"
    },
    "inconsiderate": {
      "stepmom": "female",
      "stepmother": "female",
      "stepdad": "male",
      "stepfather": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 164
  },
  {
    "type": "or",
    "considerate": {
      "step-parents": "a"
    },
    "inconsiderate": {
      "stepmothers": "female",
      "stepfathers": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 165
  },
  {
    "type": "or",
    "considerate": {
      "titan": "a"
    },
    "inconsiderate": {
      "superwoman": "female",
      "superman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 166
  },
  {
    "type": "or",
    "considerate": {
      "titans": "a"
    },
    "inconsiderate": {
      "superwomen": "female",
      "supermen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 167
  },
  {
    "type": "or",
    "considerate": {
      "inhumane": "a"
    },
    "inconsiderate": {
      "unwomanly": "female",
      "unwomenly": "female",
      "unmanly": "male",
      "unmenly": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 168
  },
  {
    "type": "or",
    "considerate": {
      "watcher": "a"
    },
    "inconsiderate": {
      "watchwoman": "female",
      "watchman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 169
  },
  {
    "type": "or",
    "considerate": {
      "watchers": "a"
    },
    "inconsiderate": {
      "watchwomen": "female",
      "watchmen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 170
  },
  {
    "type": "or",
    "considerate": {
      "weather forecaster": "a",
      "meteorologist": "a"
    },
    "inconsiderate": {
      "weatherwoman": "female",
      "weatherman": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 171
  },
  {
    "type": "or",
    "considerate": {
      "weather forecasters": "a",
      "meteorologists": "a"
    },
    "inconsiderate": {
      "weatherwomen": "female",
      "weathermen": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 172
  },
  {
    "type": "or",
    "considerate": {
      "bereaved": "a"
    },
    "inconsiderate": {
      "widow": "female",
      "widows": "female",
      "widower": "male",
      "widowers": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 173
  },
  {
    "type": "or",
    "considerate": {
      "own person": "a"
    },
    "inconsiderate": {
      "own woman": "female",
      "own man": "male"
    },
    "categories": [
      "female",
      "male"
    ],
    "id": 174
  },
  {
    "type": "simple",
    "considerate": {
      "french": "a"
    },
    "inconsiderate": {
      "frenchmen": "male"
    },
    "categories": [
      "male"
    ],
    "id": 175
  },
  {
    "type": "simple",
    "considerate": {
      "courteous": "a",
      "cultured": "a"
    },
    "inconsiderate": {
      "ladylike": "female"
    },
    "categories": [
      "female"
    ],
    "id": 176
  },
  {
    "type": "simple",
    "considerate": {
      "resolutely": "a",
      "bravely": "a"
    },
    "inconsiderate": {
      "like a man": "male"
    },
    "categories": [
      "male"
    ],
    "id": 177
  },
  {
    "type": "simple",
    "considerate": {
      "birth name": "a"
    },
    "inconsiderate": {
      "maiden name": "female"
    },
    "categories": [
      "female"
    ],
    "id": 178
  },
  {
    "type": "simple",
    "considerate": {
      "first voyage": "a"
    },
    "inconsiderate": {
      "maiden voyage": "female"
    },
    "categories": [
      "female"
    ],
    "id": 179
  },
  {
    "type": "simple",
    "considerate": {
      "strong enough": "a"
    },
    "inconsiderate": {
      "man enough": "male"
    },
    "categories": [
      "male"
    ],
    "id": 180
  },
  {
    "type": "simple",
    "considerate": {
      "upstaging": "a",
      "competitiveness": "a"
    },
    "inconsiderate": {
      "oneupmanship": "male"
    },
    "categories": [
      "male"
    ],
    "id": 181
  },
  {
    "type": "simple",
    "considerate": {
      "ms.": "a"
    },
    "inconsiderate": {
      "miss.": "female",
      "mrs.": "female"
    },
    "categories": [
      "female"
    ],
    "id": 182
  },
  {
    "type": "simple",
    "considerate": {
      "manufactured": "a",
      "artificial": "a",
      "synthetic": "a",
      "machine-made": "a"
    },
    "inconsiderate": {
      "manmade": "male"
    },
    "categories": [
      "male"
    ],
    "id": 183
  },
  {
    "type": "simple",
    "considerate": {
      "dynamo": "a"
    },
    "inconsiderate": {
      "man of action": "male"
    },
    "categories": [
      "male"
    ],
    "id": 184
  },
  {
    "type": "simple",
    "considerate": {
      "scholar": "a",
      "writer": "a",
      "literary figure": "a"
    },
    "inconsiderate": {
      "man of letters": "male"
    },
    "categories": [
      "male"
    ],
    "id": 185
  },
  {
    "type": "simple",
    "considerate": {
      "sophisticate": "a"
    },
    "inconsiderate": {
      "man of the world": "male"
    },
    "categories": [
      "male"
    ],
    "id": 186
  },
  {
    "type": "simple",
    "considerate": {
      "camaraderie": "a"
    },
    "inconsiderate": {
      "fellowship": "male"
    },
    "categories": [
      "male"
    ],
    "id": 187
  },
  {
    "type": "simple",
    "considerate": {
      "first-year student": "a",
      "fresher": "a"
    },
    "inconsiderate": {
      "freshman": "male",
      "freshwoman": "male"
    },
    "categories": [
      "male"
    ],
    "id": 188
  },
  {
    "type": "simple",
    "considerate": {
      "quality construction": "a",
      "expertise": "a"
    },
    "inconsiderate": {
      "workmanship": "male"
    },
    "categories": [
      "male"
    ],
    "id": 189
  },
  {
    "type": "simple",
    "considerate": {
      "homemaker": "a",
      "homeworker": "a"
    },
    "inconsiderate": {
      "housewife": "female"
    },
    "categories": [
      "female"
    ],
    "id": 190
  },
  {
    "type": "simple",
    "considerate": {
      "homemakers": "a",
      "homeworkers": "a"
    },
    "inconsiderate": {
      "housewifes": "female"
    },
    "categories": [
      "female"
    ],
    "id": 191
  },
  {
    "type": "simple",
    "considerate": {
      "loving": "a",
      "warm": "a",
      "nurturing": "a"
    },
    "inconsiderate": {
      "motherly": "female"
    },
    "categories": [
      "female"
    ],
    "id": 192
  },
  {
    "type": "simple",
    "considerate": {
      "human resources": "a"
    },
    "inconsiderate": {
      "manpower": "male"
    },
    "categories": [
      "male"
    ],
    "id": 193
  },
  {
    "type": "simple",
    "considerate": {
      "emcee": "a",
      "moderator": "a",
      "convenor": "a"
    },
    "inconsiderate": {
      "master of ceremonies": "male"
    },
    "categories": [
      "male"
    ],
    "id": 194
  },
  {
    "type": "simple",
    "considerate": {
      "skilled": "a",
      "authoritative": "a",
      "commanding": "a"
    },
    "inconsiderate": {
      "masterful": "male"
    },
    "categories": [
      "male"
    ],
    "id": 195
  },
  {
    "type": "simple",
    "considerate": {
      "genius": "a",
      "creator": "a",
      "instigator": "a",
      "oversee": "a",
      "launch": "a",
      "originate": "a"
    },
    "inconsiderate": {
      "mastermind": "male"
    },
    "categories": [
      "male"
    ],
    "id": 196
  },
  {
    "type": "simple",
    "considerate": {
      "work of genius": "a",
      "chef d’oeuvre": "a"
    },
    "inconsiderate": {
      "masterpiece": "male"
    },
    "categories": [
      "male"
    ],
    "id": 197
  },
  {
    "type": "simple",
    "considerate": {
      "vision": "a",
      "comprehensive plan": "a"
    },
    "inconsiderate": {
      "masterplan": "male"
    },
    "categories": [
      "male"
    ],
    "id": 198
  },
  {
    "type": "simple",
    "considerate": {
      "trump card": "a",
      "stroke of genius": "a"
    },
    "inconsiderate": {
      "masterstroke": "male"
    },
    "categories": [
      "male"
    ],
    "id": 199
  },
  {
    "type": "simple",
    "considerate": {
      "sociopath": "a"
    },
    "inconsiderate": {
      "madman": "male",
      "mad man": "male"
    },
    "categories": [
      "male"
    ],
    "id": 200
  },
  {
    "type": "simple",
    "considerate": {
      "sociopaths": "a"
    },
    "inconsiderate": {
      "madmen": "male",
      "mad men": "male"
    },
    "categories": [
      "male"
    ],
    "id": 201
  },
  {
    "type": "simple",
    "considerate": {
      "humankind": "a"
    },
    "inconsiderate": {
      "mankind": "male"
    },
    "categories": [
      "male"
    ],
    "id": 202
  },
  {
    "type": "simple",
    "considerate": {
      "staff hours": "a",
      "hours of work": "a"
    },
    "inconsiderate": {
      "manhour": "male",
      "man hour": "male"
    },
    "categories": [
      "male"
    ],
    "id": 203
  },
  {
    "type": "simple",
    "considerate": {
      "staffed": "a",
      "crewed": "a",
      "pilotted": "a"
    },
    "inconsiderate": {
      "manned": "a"
    },
    "categories": [
      "a"
    ],
    "id": 204
  },
  {
    "type": "simple",
    "considerate": {
      "robotic": "a",
      "automated": "a"
    },
    "inconsiderate": {
      "unmanned": "a"
    },
    "categories": [
      "a"
    ],
    "id": 205
  },
  {
    "type": "simple",
    "considerate": {
      "whining": "a",
      "complaining": "a",
      "crying": "a"
    },
    "inconsiderate": {
      "bitching": "a",
      "moaning": "a"
    },
    "categories": [
      "a"
    ],
    "id": 206
  },
  {
    "type": "simple",
    "considerate": {
      "whine": "a",
      "complain": "a",
      "cry": "a"
    },
    "inconsiderate": {
      "bitch": "a",
      "moan": "a"
    },
    "categories": [
      "a"
    ],
    "id": 207
  },
  {
    "type": "simple",
    "considerate": {
      "person with learning disabilities": "a"
    },
    "inconsiderate": {
      "learning disabled": "a"
    },
    "categories": [
      "a"
    ],
    "id": 208
  },
  {
    "type": "simple",
    "considerate": {
      "person with disabilities": "a"
    },
    "inconsiderate": {
      "disabled": "a"
    },
    "categories": [
      "a"
    ],
    "id": 209
  },
  {
    "type": "simple",
    "considerate": {
      "rude": "a",
      "mean": "a",
      "disgusting": "a",
      "vile": "a",
      "person with mental illness": "a",
      "person with symptoms of mental illness": "a"
    },
    "inconsiderate": {
      "batshit": "a",
      "psycho": "a",
      "crazy": "a",
      "insane": "a",
      "loony": "a",
      "lunacy": "a",
      "lunatic": "a",
      "mentally ill": "a"
    },
    "categories": [
      "a"
    ],
    "id": 210
  },
  {
    "type": "simple",
    "considerate": {
      "fluctuating": "a",
      "person with schizophrenia": "a",
      "person with bi-polar disorder": "a"
    },
    "inconsiderate": {
      "bi-polar": "a",
      "schizophrenic": "a",
      "schizo": "a"
    },
    "categories": [
      "a"
    ],
    "id": 211
  },
  {
    "type": "simple",
    "considerate": {
      "person with physical handicaps": "a"
    },
    "inconsiderate": {
      "handicapped": "a"
    },
    "categories": [
      "a"
    ],
    "id": 212
  },
  {
    "type": "simple",
    "considerate": {
      "person with an amputation": "a"
    },
    "inconsiderate": {
      "amputee": "a"
    },
    "categories": [
      "a"
    ],
    "id": 213
  },
  {
    "type": "simple",
    "considerate": {
      "person with a limp": "a"
    },
    "inconsiderate": {
      "cripple": "a"
    },
    "categories": [
      "a"
    ],
    "id": 214
  },
  {
    "type": "simple",
    "considerate": {
      "person with Down’s Syndrome": "a"
    },
    "inconsiderate": {
      "mongoloid": "a"
    },
    "categories": [
      "a"
    ],
    "id": 215
  },
  {
    "type": "simple",
    "considerate": {
      "individual who has had a stroke": "a"
    },
    "inconsiderate": {
      "stroke victim": "a"
    },
    "categories": [
      "a"
    ],
    "id": 216
  },
  {
    "type": "simple",
    "considerate": {
      "person who has multiple sclerosis": "a"
    },
    "inconsiderate": {
      "suffering from multiple sclerosis": "a"
    },
    "categories": [
      "a"
    ],
    "id": 217
  },
  {
    "type": "simple",
    "considerate": {
      "with family support needs": "a"
    },
    "inconsiderate": {
      "family burden": "a"
    },
    "categories": [
      "a"
    ],
    "id": 218
  },
  {
    "type": "simple",
    "considerate": {
      "chaos": "a",
      "hectic": "a",
      "pandemonium": "a"
    },
    "inconsiderate": {
      "bedlam": "a",
      "madhouse": "a"
    },
    "categories": [
      "a"
    ],
    "id": 219
  },
  {
    "type": "simple",
    "considerate": {
      "silly": "a",
      "dullard": "a",
      "person with developmental disabilities": "a",
      "delay": "a",
      "hold back": "a"
    },
    "inconsiderate": {
      "retard": "a",
      "retarded": "a"
    },
    "categories": [
      "a"
    ],
    "id": 220
  },
  {
    "type": "simple",
    "considerate": {
      "sillies": "a",
      "dullards": "a",
      "people with developmental disabilities": "a",
      "delays": "a",
      "holds back": "a"
    },
    "inconsiderate": {
      "retards": "a"
    },
    "categories": [
      "a"
    ],
    "id": 221
  },
  {
    "type": "simple",
    "considerate": {
      "person with psychosis": "a"
    },
    "inconsiderate": {
      "psychotic": "a"
    },
    "categories": [
      "a"
    ],
    "id": 222
  },
  {
    "type": "simple",
    "considerate": {
      "boring": "a",
      "dull": "a"
    },
    "inconsiderate": {
      "lame": "a"
    },
    "categories": [
      "a"
    ],
    "id": 223
  },
  {
    "type": "simple",
    "considerate": {
      "Armenian person": "a",
      "Armenian American": "a"
    },
    "inconsiderate": {
      "armo": "a"
    },
    "categories": [
      "a"
    ],
    "id": 224
  },
  {
    "type": "simple",
    "considerate": {
      "Armenian people": "a",
      "Armenian Americans": "a"
    },
    "inconsiderate": {
      "armos": "a"
    },
    "categories": [
      "a"
    ],
    "id": 225
  },
  {
    "type": "simple",
    "considerate": {
      "Australian Aboriginal": "a",
      "people of the pacific islands": "a"
    },
    "inconsiderate": {
      "boongas": "a",
      "boongs": "a",
      "bungas": "a",
      "boonies": "a"
    },
    "categories": [
      "a"
    ],
    "id": 226
  },
  {
    "type": "simple",
    "considerate": {
      "Australian Aboriginal": "a",
      "pacific islander": "a"
    },
    "inconsiderate": {
      "boonga": "a",
      "boong": "a",
      "bong": "a",
      "bung": "a",
      "bunga": "a",
      "boonie": "a"
    },
    "categories": [
      "a"
    ],
    "id": 227
  },
  {
    "type": "simple",
    "considerate": {
      "Dutch person": "a"
    },
    "inconsiderate": {
      "cheesehead": "a"
    },
    "categories": [
      "a"
    ],
    "id": 228
  },
  {
    "type": "simple",
    "considerate": {
      "Dutch people": "a"
    },
    "inconsiderate": {
      "cheeseheads": "a"
    },
    "categories": [
      "a"
    ],
    "id": 229
  },
  {
    "type": "simple",
    "considerate": {
      "French person": "a"
    },
    "inconsiderate": {
      "cheeseeating surrender monkey": "a",
      "cheese eating surrender monkey": "a"
    },
    "categories": [
      "a"
    ],
    "id": 230
  },
  {
    "type": "simple",
    "considerate": {
      "French people": "a"
    },
    "inconsiderate": {
      "cheeseeating surrender monkies": "a",
      "cheese eating surrender monkies": "a"
    },
    "categories": [
      "a"
    ],
    "id": 231
  },
  {
    "type": "simple",
    "considerate": {
      "Finnish American": "a"
    },
    "inconsiderate": {
      "chinaswede": "a",
      "china swede": "a"
    },
    "categories": [
      "a"
    ],
    "id": 232
  },
  {
    "type": "simple",
    "considerate": {
      "Finnish Americans": "a"
    },
    "inconsiderate": {
      "chinaswedes": "a",
      "china swedes": "a"
    },
    "categories": [
      "a"
    ],
    "id": 233
  },
  {
    "type": "simple",
    "considerate": {
      "Chinese person": "a"
    },
    "inconsiderate": {
      "chinamen": "a"
    },
    "categories": [
      "a"
    ],
    "id": 234
  },
  {
    "type": "simple",
    "considerate": {
      "Chinese people": "a"
    },
    "inconsiderate": {
      "ching chong": "a",
      "chinaman": "a"
    },
    "categories": [
      "a"
    ],
    "id": 235
  },
  {
    "type": "simple",
    "considerate": {
      "Chinese person": "a",
      "Asian person": "a"
    },
    "inconsiderate": {
      "banana": "a",
      "ching chong": "a",
      "chink": "a"
    },
    "categories": [
      "a"
    ],
    "id": 236
  },
  {
    "type": "simple",
    "considerate": {
      "Chinese people": "a",
      "Asian people": "a"
    },
    "inconsiderate": {
      "bananas": "a",
      "ching chongs": "a",
      "chinks": "a"
    },
    "categories": [
      "a"
    ],
    "id": 237
  },
  {
    "type": "simple",
    "considerate": {
      "Chinese person": "a",
      "Korean person": "a"
    },
    "inconsiderate": {
      "chonky": "a",
      "chunky": "a",
      "chunger": "a"
    },
    "categories": [
      "a"
    ],
    "id": 238
  },
  {
    "type": "simple",
    "considerate": {
      "Chinese people": "a",
      "Korean people": "a"
    },
    "inconsiderate": {
      "chonkies": "a",
      "chunkies": "a",
      "chonkys": "a",
      "chunkys": "a",
      "chungers": "a"
    },
    "categories": [
      "a"
    ],
    "id": 239
  },
  {
    "type": "simple",
    "considerate": {
      "Canadian Aboriginal": "a"
    },
    "inconsiderate": {
      "chug": "a"
    },
    "categories": [
      "a"
    ],
    "id": 240
  },
  {
    "type": "simple",
    "considerate": {
      "Canadian Aboriginals": "a"
    },
    "inconsiderate": {
      "chugs": "a"
    },
    "categories": [
      "a"
    ],
    "id": 241
  },
  {
    "type": "simple",
    "considerate": {
      "hispanic person": "a",
      "person of color": "a",
      "black person": "a"
    },
    "inconsiderate": {
      "coconut": "a",
      "oreo": "a"
    },
    "categories": [
      "a"
    ],
    "id": 242
  },
  {
    "type": "simple",
    "considerate": {
      "hispanic people": "a",
      "people of color": "a",
      "black people": "a"
    },
    "inconsiderate": {
      "coconuts": "a",
      "oreos": "a"
    },
    "categories": [
      "a"
    ],
    "id": 243
  },
  {
    "type": "simple",
    "considerate": {
      "Cajun": "a"
    },
    "inconsiderate": {
      "coonass": "a",
      "coon ass": "a"
    },
    "categories": [
      "a"
    ],
    "id": 244
  },
  {
    "type": "simple",
    "considerate": {
      "Cajun people": "a"
    },
    "inconsiderate": {
      "coonasses": "a",
      "coon asses": "a"
    },
    "categories": [
      "a"
    ],
    "id": 245
  },
  {
    "type": "simple",
    "considerate": {
      "Indian person": "a"
    },
    "inconsiderate": {
      "currymuncher": "a",
      "curry muncher": "a"
    },
    "categories": [
      "a"
    ],
    "id": 246
  },
  {
    "type": "simple",
    "considerate": {
      "Indian people": "a"
    },
    "inconsiderate": {
      "currymunchers": "a",
      "curry munchers": "a"
    },
    "categories": [
      "a"
    ],
    "id": 247
  },
  {
    "type": "simple",
    "considerate": {
      "Hindi person": "a"
    },
    "inconsiderate": {
      "Dotheads": "a",
      "Dot heads": "a"
    },
    "categories": [
      "a"
    ],
    "id": 248
  },
  {
    "type": "simple",
    "considerate": {
      "Hindi people": "a"
    },
    "inconsiderate": {
      "Dothead": "a",
      "Dot head": "a"
    },
    "categories": [
      "a"
    ],
    "id": 249
  },
  {
    "type": "simple",
    "considerate": {
      "caribbean people": "a"
    },
    "inconsiderate": {
      "golliwogs": "a"
    },
    "categories": [
      "a"
    ],
    "id": 250
  },
  {
    "type": "simple",
    "considerate": {
      "caribbean person": "a"
    },
    "inconsiderate": {
      "golliwog": "a"
    },
    "categories": [
      "a"
    ],
    "id": 251
  },
  {
    "type": "simple",
    "considerate": {
      "foreigners": "a"
    },
    "inconsiderate": {
      "guizi": "a"
    },
    "categories": [
      "a"
    ],
    "id": 252
  },
  {
    "type": "simple",
    "considerate": {
      "romani person": "a"
    },
    "inconsiderate": {
      "gyppos": "a",
      "gippos": "a",
      "gypos": "a",
      "gyppies": "a",
      "gyppys": "a",
      "gipps": "a",
      "gypsys": "a",
      "gypsies": "a"
    },
    "categories": [
      "a"
    ],
    "id": 253
  },
  {
    "type": "simple",
    "considerate": {
      "romani people": "a"
    },
    "inconsiderate": {
      "gyppo": "a",
      "gippo": "a",
      "gypo": "a",
      "gyppie": "a",
      "gyppy": "a",
      "gipp": "a",
      "gypsy": "a"
    },
    "categories": [
      "a"
    ],
    "id": 254
  },
  {
    "type": "simple",
    "considerate": {
      "afrikaner": "a"
    },
    "inconsiderate": {
      "hairyback": "a"
    },
    "categories": [
      "a"
    ],
    "id": 255
  },
  {
    "type": "simple",
    "considerate": {
      "afrikaners": "a"
    },
    "inconsiderate": {
      "hairybacks": "a"
    },
    "categories": [
      "a"
    ],
    "id": 256
  },
  {
    "type": "simple",
    "considerate": {
      "Maori person": "a"
    },
    "inconsiderate": {
      "hori": "a"
    },
    "categories": [
      "a"
    ],
    "id": 257
  },
  {
    "type": "simple",
    "considerate": {
      "Maoris": "a"
    },
    "inconsiderate": {
      "horis": "a"
    },
    "categories": [
      "a"
    ],
    "id": 258
  },
  {
    "type": "simple",
    "considerate": {
      "Indonesian person": "a"
    },
    "inconsiderate": {
      "jap": "a"
    },
    "categories": [
      "a"
    ],
    "id": 259
  },
  {
    "type": "simple",
    "considerate": {
      "Indonesians": "a"
    },
    "inconsiderate": {
      "indons": "a"
    },
    "categories": [
      "a"
    ],
    "id": 260
  },
  {
    "type": "simple",
    "considerate": {
      "Japanese person": "a"
    },
    "inconsiderate": {
      "jap": "a"
    },
    "categories": [
      "a"
    ],
    "id": 261
  },
  {
    "type": "simple",
    "considerate": {
      "Japanese": "a"
    },
    "inconsiderate": {
      "japs": "a"
    },
    "categories": [
      "a"
    ],
    "id": 262
  },
  {
    "type": "simple",
    "considerate": {
      "Koreans": "a"
    },
    "inconsiderate": {
      "gyopos": "a",
      "kyopos": "a",
      "kimchis": "a"
    },
    "categories": [
      "a"
    ],
    "id": 263
  },
  {
    "type": "simple",
    "considerate": {
      "Korean person": "a"
    },
    "inconsiderate": {
      "gyopo": "a",
      "kyopo": "a",
      "kimchi": "a"
    },
    "categories": [
      "a"
    ],
    "id": 264
  },
  {
    "type": "simple",
    "considerate": {
      "lebanese": "a"
    },
    "inconsiderate": {
      "lebos": "a"
    },
    "categories": [
      "a"
    ],
    "id": 265
  },
  {
    "type": "simple",
    "considerate": {
      "lebanese person": "a"
    },
    "inconsiderate": {
      "lebo": "a"
    },
    "categories": [
      "a"
    ],
    "id": 266
  },
  {
    "type": "simple",
    "considerate": {
      "lithuanians": "a"
    },
    "inconsiderate": {
      "lugans": "a"
    },
    "categories": [
      "a"
    ],
    "id": 267
  },
  {
    "type": "simple",
    "considerate": {
      "lithuanian person": "a"
    },
    "inconsiderate": {
      "lugan": "a"
    },
    "categories": [
      "a"
    ],
    "id": 268
  },
  {
    "type": "simple",
    "considerate": {
      "russians": "a"
    },
    "inconsiderate": {
      "moskals": "a"
    },
    "categories": [
      "a"
    ],
    "id": 269
  },
  {
    "type": "simple",
    "considerate": {
      "russian person": "a"
    },
    "inconsiderate": {
      "moskal": "a"
    },
    "categories": [
      "a"
    ],
    "id": 270
  },
  {
    "type": "simple",
    "considerate": {
      "Poles": "a",
      "Slavs": "a"
    },
    "inconsiderate": {
      "polacks": "a",
      "pollocks": "a"
    },
    "categories": [
      "a"
    ],
    "id": 271
  },
  {
    "type": "simple",
    "considerate": {
      "Pole": "a",
      "Slav": "a",
      "Polish person": "a",
      "Slavic person": "a"
    },
    "inconsiderate": {
      "polack": "a",
      "pollock": "a"
    },
    "categories": [
      "a"
    ],
    "id": 272
  },
  {
    "type": "simple",
    "considerate": {
      "English": "a",
      "Brittish": "a"
    },
    "inconsiderate": {
      "lebo": "a",
      "pom": "a",
      "poms": "a",
      "pohm": "a",
      "pohms": "a",
      "pommy": "a",
      "pommie": "a",
      "pommies": "a",
      "pommie grant": "a",
      "pommie grants": "a"
    },
    "categories": [
      "a"
    ],
    "id": 273
  },
  {
    "type": "simple",
    "considerate": {
      "Hispanic": "a",
      "Spanish": "a"
    },
    "inconsiderate": {
      "spic": "a",
      "spick": "a",
      "spik": "a",
      "spig": "a",
      "spigotty": "a"
    },
    "categories": [
      "a"
    ],
    "id": 274
  },
  {
    "type": "simple",
    "considerate": {
      "German": "a"
    },
    "inconsiderate": {
      "boche": "a",
      "bosche": "a",
      "bosch": "a",
      "hun": "a",
      "jerry": "a",
      "kraut": "a",
      "piefke": "a",
      "squarehead": "a"
    },
    "categories": [
      "a"
    ],
    "id": 275
  },
  {
    "type": "simple",
    "considerate": {
      "Germans": "a"
    },
    "inconsiderate": {
      "boches": "a",
      "bosches": "a",
      "boschs": "a",
      "huns": "a",
      "jerries": "a",
      "krauts": "a",
      "piefkes": "a",
      "squareheads": "a"
    },
    "categories": [
      "a"
    ],
    "id": 276
  },
  {
    "type": "simple",
    "considerate": {
      "female Australian Aboriginal": "a"
    },
    "inconsiderate": {
      "lubra": "a"
    },
    "categories": [
      "a"
    ],
    "id": 277
  },
  {
    "type": "simple",
    "considerate": {
      "female Native American": "a"
    },
    "inconsiderate": {
      "squa": "a",
      "skwa": "a",
      "esqua": "a",
      "sqeh": "a",
      "skwe": "a",
      "que": "a",
      "kwa": "a",
      "ikwe": "a",
      "exkwew": "a",
      "xkwe": "a"
    },
    "categories": [
      "a"
    ],
    "id": 278
  },
  {
    "type": "simple",
    "considerate": {
      "italian": "a"
    },
    "inconsiderate": {
      "dago": "a",
      "dego": "a",
      "greaseball": "a",
      "greaser": "a",
      "guinea": "a",
      "ginzo": "a",
      "swamp guinea": "a"
    },
    "categories": [
      "a"
    ],
    "id": 279
  },
  {
    "type": "simple",
    "considerate": {
      "italians": "a"
    },
    "inconsiderate": {
      "dagos": "a",
      "degos": "a",
      "greaseballs": "a",
      "greasers": "a",
      "guineas": "a",
      "ginzos": "a",
      "swamp guineas": "a"
    },
    "categories": [
      "a"
    ],
    "id": 280
  },
  {
    "type": "simple",
    "considerate": {
      "person of color": "a",
      "black person": "a",
      "non-Muslim": "a"
    },
    "inconsiderate": {
      "kaffir": "a",
      "kaffer": "a",
      "kafir": "a",
      "kaffre": "a",
      "kuffar": "a"
    },
    "categories": [
      "a"
    ],
    "id": 281
  },
  {
    "type": "simple",
    "considerate": {
      "african americans": "a",
      "south americans": "a",
      "caribbean people": "a",
      "africans": "a",
      "people of color": "a",
      "black people": "a"
    },
    "inconsiderate": {
      "abid": "a",
      "abeed": "a",
      "bluegums": "a",
      "bootlips": "a",
      "bounty bars": "a",
      "brownies": "a",
      "buffies": "a",
      "burrheads": "a",
      "burr heads": "a",
      "coons": "a",
      "darkeys": "a",
      "darkies": "a",
      "eight balls": "a",
      "gables": "a",
      "groids": "a",
      "jigaboos": "a",
      "jiggabos": "a",
      "jigaroonis": "a",
      "jijjiboos": "a",
      "zigabos": "a",
      "jigs": "a",
      "jiggs": "a",
      "jiggas": "a",
      "jiggers": "a",
      "jungle bunnies": "a",
      "macacas": "a",
      "maumaus": "a",
      "mau maus": "a",
      "mooncrickets": "a",
      "moon crickets": "a",
      "pickaninnies": "a",
      "porch monkies": "a",
      "sambos": "a",
      "spades": "a",
      "spearchuckers": "a",
      "sooties": "a",
      "schvartsen": "a",
      "schwartzen": "a",
      "thicklips": "a",
      "tar babies": "a",
      "niggers": "a",
      "negros": "a",
      "nigers": "a",
      "nigs": "a",
      "nigors": "a",
      "nigras": "a",
      "nigres": "a",
      "nigars": "a",
      "niggurs": "a",
      "niggas": "a",
      "niggahs": "a",
      "niggars": "a",
      "nigguhs": "a",
      "niggresses": "a",
      "nigettes": "a"
    },
    "categories": [
      "a"
    ],
    "id": 282
  },
  {
    "type": "simple",
    "considerate": {
      "african american": "a",
      "south american": "a",
      "caribbean person": "a",
      "african": "a",
      "person of color": "a",
      "black person": "a"
    },
    "inconsiderate": {
      "abid": "a",
      "abeed": "a",
      "alligator bait": "a",
      "gator bait": "a",
      "bluegum": "a",
      "bootlip": "a",
      "bounty bar": "a",
      "brownie": "a",
      "buffy": "a",
      "burrhead": "a",
      "burr head": "a",
      "coon": "a",
      "darky": "a",
      "darkey": "a",
      "darkie": "a",
      "gable": "a",
      "eight ball": "a",
      "groid": "a",
      "jigaboo": "a",
      "jiggabo": "a",
      "jigarooni": "a",
      "jijjiboo": "a",
      "zigabo": "a",
      "jig": "a",
      "jigg": "a",
      "jigga": "a",
      "jigger": "a",
      "jungle bunny": "a",
      "macaca": "a",
      "maumau": "a",
      "mau mau": "a",
      "mooncricket": "a",
      "moon cricket": "a",
      "pickaninny": "a",
      "porch monkey": "a",
      "sambo": "a",
      "spade": "a",
      "spearchuckers": "a",
      "sooty": "a",
      "schvartse": "a",
      "schwartze": "a",
      "thicklip": "a",
      "tar baby": "a",
      "nigger": "a",
      "negro": "a",
      "niger": "a",
      "nig": "a",
      "nigor": "a",
      "nigra": "a",
      "nigre": "a",
      "nigar": "a",
      "niggur": "a",
      "nigga": "a",
      "niggah": "a",
      "niggar": "a",
      "nigguh": "a",
      "niggress": "a",
      "nigette": "a"
    },
    "categories": [
      "a"
    ],
    "id": 283
  },
  {
    "type": "simple",
    "considerate": {
      "Native Americans": "a"
    },
    "inconsiderate": {
      "injuns": "a",
      "prairie niggers": "a",
      "redskins": "a",
      "timber niggers": "a"
    },
    "categories": [
      "a"
    ],
    "id": 284
  },
  {
    "type": "simple",
    "considerate": {
      "Native American": "a"
    },
    "inconsiderate": {
      "injun": "a",
      "prairie nigger": "a",
      "redskin": "a",
      "timber nigger": "a"
    },
    "categories": [
      "a"
    ],
    "id": 285
  },
  {
    "type": "simple",
    "considerate": {
      "middle eastern person": "a",
      "arabic person": "a"
    },
    "inconsiderate": {
      "arabush": "a",
      "camel jockey": "a",
      "dune coon": "a",
      "hajji": "a",
      "hadji": "a",
      "haji": "a"
    },
    "categories": [
      "a"
    ],
    "id": 286
  },
  {
    "type": "simple",
    "considerate": {
      "middle eastern people": "a",
      "arabic people": "a"
    },
    "inconsiderate": {
      "arabushs": "a",
      "camel jockeys": "a",
      "dune coons": "a",
      "hajjis": "a",
      "hadjis": "a",
      "hajis": "a"
    },
    "categories": [
      "a"
    ],
    "id": 287
  },
  {
    "type": "simple",
    "considerate": {
      "sikhs": "a",
      "arabs": "a",
      "muslims": "a"
    },
    "inconsiderate": {
      "pakis": "a",
      "ragheads": "a",
      "sand niggers": "a",
      "towel heads": "a"
    },
    "categories": [
      "a"
    ],
    "id": 288
  },
  {
    "type": "simple",
    "considerate": {
      "sikh": "a",
      "arab": "a",
      "muslim": "a"
    },
    "inconsiderate": {
      "pakis": "a",
      "osama": "a",
      "raghead": "a",
      "sand nigger": "a",
      "towel head": "a"
    },
    "categories": [
      "a"
    ],
    "id": 289
  },
  {
    "type": "simple",
    "considerate": {
      "mexican": "a",
      "immigrant": "a",
      "migrant worker": "a"
    },
    "inconsiderate": {
      "beaner": "a",
      "beaney": "a",
      "tacohead": "a",
      "wetback": "a",
      "illegal": "a",
      "pocho": "a",
      "pocha": "a"
    },
    "categories": [
      "a"
    ],
    "id": 290
  },
  {
    "type": "simple",
    "considerate": {
      "mexicans": "a",
      "immigrants": "a",
      "migrant workers": "a"
    },
    "inconsiderate": {
      "beaners": "a",
      "beaneys": "a",
      "tacoheads": "a",
      "wetbacks": "a",
      "illegals": "a",
      "pochos": "a",
      "pochas": "a"
    },
    "categories": [
      "a"
    ],
    "id": 291
  },
  {
    "type": "simple",
    "considerate": {
      "caucasian": "a"
    },
    "inconsiderate": {
      "bule": "a",
      "gora": "a",
      "gub": "a",
      "gubba": "a",
      "gweilo": "a",
      "gwailo": "a",
      "kwai lo": "a",
      "haole": "a",
      "honky": "a",
      "honkey": "a",
      "honkie": "a",
      "japie": "a",
      "yarpie": "a",
      "mabuno": "a",
      "mahbuno": "a",
      "klansman": "a",
      "mzungu": "a",
      "redleg": "a",
      "redneck": "a",
      "roundeye": "a",
      "whitey": "a",
      "wigger": "a",
      "whigger": "a",
      "wigga": "a"
    },
    "categories": [
      "a"
    ],
    "id": 292
  },
  {
    "type": "simple",
    "considerate": {
      "caucasians": "a"
    },
    "inconsiderate": {
      "bules": "a",
      "goras": "a",
      "gubs": "a",
      "gubbas": "a",
      "gweilos": "a",
      "gwailos": "a",
      "kwai los": "a",
      "haoles": "a",
      "honkeys": "a",
      "honkies": "a",
      "japies": "a",
      "yarpies": "a",
      "mabunos": "a",
      "mahbunos": "a",
      "klansmen": "a",
      "mzungus": "a",
      "redlegs": "a",
      "rednecks": "a",
      "round eyes": "a",
      "whities": "a",
      "whiteys": "a",
      "wiggers": "a",
      "whiggers": "a",
      "wiggas": "a",
      "write trash": "a"
    },
    "categories": [
      "a"
    ],
    "id": 293
  },
  {
    "type": "simple",
    "considerate": {
      "ukrainian": "a"
    },
    "inconsiderate": {
      "ukrop": "a",
      "khokhol": "a",
      "khokhols": "a",
      "katsap": "a",
      "kacap": "a",
      "kacapas": "a"
    },
    "categories": [
      "a"
    ],
    "id": 294
  },
  {
    "type": "simple",
    "considerate": {
      "african": "a"
    },
    "inconsiderate": {
      "uncle tom": "a"
    },
    "categories": [
      "a"
    ],
    "id": 295
  },
  {
    "type": "simple",
    "considerate": {
      "foreigner": "a",
      "asian": "a",
      "african": "a"
    },
    "inconsiderate": {
      "wog": "a"
    },
    "categories": [
      "a"
    ],
    "id": 296
  },
  {
    "type": "simple",
    "considerate": {
      "foreigners": "a",
      "asians": "a",
      "africans": "a"
    },
    "inconsiderate": {
      "wogs": "a"
    },
    "categories": [
      "a"
    ],
    "id": 297
  },
  {
    "type": "simple",
    "considerate": {
      "northerner": "a",
      "american": "a"
    },
    "inconsiderate": {
      "gringo": "a",
      "hillbilly": "a",
      "seppo": "a",
      "septic": "a",
      "yankee": "a",
      "yank": "a"
    },
    "categories": [
      "a"
    ],
    "id": 298
  },
  {
    "type": "simple",
    "considerate": {
      "northerners": "a",
      "americans": "a"
    },
    "inconsiderate": {
      "gringos": "a",
      "hillbillies": "a",
      "seppos": "a",
      "septics": "a",
      "yankees": "a",
      "yanks": "a"
    },
    "categories": [
      "a"
    ],
    "id": 299
  },
  {
    "type": "simple",
    "considerate": {
      "jew": "a"
    },
    "inconsiderate": {
      "christ killers": "a",
      "cushi": "a",
      "kushi": "a",
      "heeb": "a",
      "hebe": "a",
      "hymie": "a",
      "ike": "a",
      "ikeymo": "a",
      "kike": "a",
      "kyke": "a",
      "yid": "a",
      "shylock": "a"
    },
    "categories": [
      "a"
    ],
    "id": 300
  },
  {
    "type": "simple",
    "considerate": {
      "jews": "a"
    },
    "inconsiderate": {
      "christ killers": "a",
      "cushis": "a",
      "kushis": "a",
      "heebs": "a",
      "hebes": "a",
      "hymies": "a",
      "ikes": "a",
      "ikeymos": "a",
      "kikes": "a",
      "kykes": "a",
      "yids": "a",
      "shylocks": "a"
    },
    "categories": [
      "a"
    ],
    "id": 301
  },
  {
    "type": "simple",
    "considerate": {
      "asian": "a"
    },
    "inconsiderate": {
      "buddhahead": "a",
      "coolie": "a",
      "dink": "a",
      "gook": "a",
      "gookeye": "a",
      "gook eye": "a",
      "gooky": "a",
      "pancake face": "a",
      "slope": "a",
      "slopehead": "a",
      "slopy": "a",
      "slopey": "a",
      "sloper": "a",
      "squinty": "a",
      "zipperhead": "a"
    },
    "categories": [
      "a"
    ],
    "id": 302
  },
  {
    "type": "simple",
    "considerate": {
      "asians": "a"
    },
    "inconsiderate": {
      "buddhaheads": "a",
      "coolies": "a",
      "dinks": "a",
      "gooks": "a",
      "gookeyes": "a",
      "gook eyes": "a",
      "gookies": "a",
      "pancake faces": "a",
      "slopes": "a",
      "slopeheads": "a",
      "slopies": "a",
      "slopeys": "a",
      "slopers": "a",
      "stuinties": "a",
      "zipperheads": "a"
    },
    "categories": [
      "a"
    ],
    "id": 303
  },
  {
    "type": "and",
    "considerate": {
      "primary": "a",
      "primaries": "a",
      "replica": "b",
      "replicas": "b"
    },
    "inconsiderate": {
      "master": "a",
      "masters": "a",
      "slave": "b",
      "slaves": "b"
    },
    "categories": [
      "a",
      "b"
    ],
    "id": 304
  }
]

},{}],4:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module nlcst:is-literal
 * @fileoverview Check whether an NLCST node is meant literally.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var toString = require('nlcst-to-string');

/*
 * Single delimiters.
 */

var single = {
    '-': true, // hyphen-minus
    '–': true, // en-dash
    '—': true, // em-dash
    ':': true, // colon
    ';': true // semicolon
};

/*
 * Pair delimiters. From common sense, and wikipedia:
 * Mostly from https://en.wikipedia.org/wiki/Quotation_mark.
 */

var pairs = {
    ',': {
        ',': true
    },
    '-': {
        '-': true
    },
    '–': {
        '–': true
    },
    '—': {
        '—': true
    },
    '"': {
        '"': true
    },
    '\'': {
        '\'': true
    },
    '‘': {
        '’': true
    },
    '‚': {
        '’': true
    },
    '’': {
        '’': true,
        '‚': true
    },
    '“': {
        '”': true
    },
    '”': {
        '”': true
    },
    '„': {
        '”': true,
        '“': true
    },
    '«': {
        '»': true
    },
    '»': {
        '«': true
    },
    '‹': {
        '›': true
    },
    '›': {
        '‹': true
    },
    '(': {
        ')': true
    },
    '[': {
        ']': true
    },
    '{': {
        '}': true
    },
    '⟨': {
        '⟩': true
    },
    '「': {
        '」': true
    }
}

/**
 * Check whether parent contains word-nodes between
 * `start` and `end`.
 *
 * @param {NLCSTParentNode} parent - Node with children.
 * @param {number} start - Starting point (inclusive).
 * @param {number} end - Ending point (exclusive).
 * @return {boolean} - Whether word-nodes are found.
 */
function containsWord(parent, start, end) {
    var siblings = parent.children;
    var index = start - 1;

    while (++index < end) {
        if (siblings[index].type === 'WordNode') {
            return true;
        }
    }

    return false;
}

/**
 * Check if there are word nodes before `position`
 * in `parent`.
 *
 * @param {NLCSTParentNode} parent - Node with children.
 * @param {number} position - Position before which to
 *   check.
 * @return {boolean} - Whether word-nodes are found.
 */
function hasWordsBefore(parent, position) {
    return containsWord(parent, 0, position);
}

/**
 * Check if there are word nodes before `position`
 * in `parent`.
 *
 * @param {NLCSTParentNode} parent - Node with children.
 * @param {number} position - Position afyer which to
 *   check.
 * @return {boolean} - Whether word-nodes are found.
 */
function hasWordsAfter(parent, position) {
    return containsWord(parent, position + 1, parent.children.length);
}

/**
 * Check if `node` is in `delimiters`.
 *
 * @param {Node} node - Node to check.
 * @param {Object} delimiters - Map of delimiters.
 * @return {(Node|boolean)?} - `false` if not, the given
 *   node when true, and `null` when this is a white-space
 *   node.
 */
function delimiterCheck(node, delimiters) {
    var type = node.type;

    if (type === 'WordNode' || type === 'SourceNode') {
        return false;
    }

    if (type === 'WhiteSpaceNode') {
        return null;
    }

    return toString(node) in delimiters ? node : false;
}

/**
 * Find the next delimiter after `position` in
 * `parent`. Returns the delimiter node when found.
 *
 * @param {NLCSTParentNode} parent - Parent to search.
 * @param {number} position - Position to search after.
 * @param {Object} delimiters - Map of delimiters.
 * @return {Node?} - Following delimiter.
 */
function nextDelimiter(parent, position, delimiters) {
    var siblings = parent.children;
    var index = position;
    var length = siblings.length;
    var result;

    while (++index < length) {
        result = delimiterCheck(siblings[index], delimiters);

        if (result === null) {
            continue;
        }

        return result;
    }

    return null;
}

/**
 * Find the previous delimiter before `position` in
 * `parent`. Returns the delimiter node when found.
 *
 * @param {NLCSTParentNode} parent - Parent to search.
 * @param {number} position - Position to search before.
 * @param {Object} delimiters - Map of delimiters.
 * @return {Node?} - Previous delimiter.
 */
function previousDelimiter(parent, position, delimiters) {
    var siblings = parent.children;
    var index = position;
    var result;

    while (index--) {
        result = delimiterCheck(siblings[index], delimiters);

        if (result === null) {
            continue;
        }

        return result;
    }

    return null;
}

/**
 * Check if the node in `parent` at `position` is enclosed
 * by matching delimiters.
 *
 * @param {NLCSTParentNode} parent - Parent to search.
 * @param {number} position - Position of node to check.
 * @param {Object} delimiters - Map of delimiters.
 * @return {boolean} - Whether the node is wrapped.
 */
function isWrapped(parent, position, delimiters) {
    var prev = previousDelimiter(parent, position, delimiters);
    var next;

    if (prev) {
        next = nextDelimiter(parent, position, delimiters[toString(prev)]);
    }

    return Boolean(next);
}

/**
 * Check if the node in `parent` at `position` is enclosed
 * by matching delimiters.
 *
 * For example, in:
 *
 * -   `Foo - is meant as a literal.`;
 * -   `Meant as a literal is - foo.`;
 * -   `The word “foo” is meant as a literal.`;
 *
 * ...`foo` is literal.
 *
 * @param {NLCSTParentNode} parent - Parent to search.
 * @param {number} index - Position of node to check.
 * @return {boolean} - Whether the node is wrapped.
 */
function isLiteral(parent, index) {
    if (!(parent && parent.children)) {
        throw new Error('Parent must be a node');
    }

    if (isNaN(index)) {
        throw new Error('Index must be a number');
    }

    if (
        (!hasWordsBefore(parent, index) && nextDelimiter(parent, index, single)) ||
        (!hasWordsAfter(parent, index) && previousDelimiter(parent, index, single)) ||
        isWrapped(parent, index, pairs)
    ) {
        return true;
    }

    return false;
}

/*
 * Expose.
 */

module.exports = isLiteral;

},{"nlcst-to-string":5}],5:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module nlcst:to-string
 * @fileoverview Transform an NLCST node into a string.
 */

'use strict';

/* eslint-env commonjs */

/**
 * Stringify an NLCST node.
 *
 * @param {NLCSTNode|Array.<NLCSTNode>} node - Node to to
 *   stringify.
 * @return {string} - Stringified `node`.
 */
function nlcstToString(node) {
    var values;
    var length;
    var children;

    if (typeof node.value === 'string') {
        return node.value;
    }

    children = 'length' in node ? node : node.children;
    length = children.length;

    /*
     * Shortcut: This is pretty common, and a small performance win.
     */

    if (length === 1 && 'value' in children[0]) {
        return children[0].value;
    }

    values = [];

    while (length--) {
        values[length] = nlcstToString(children[length]);
    }

    return values.join('');
}

/*
 * Expose.
 */

module.exports = nlcstToString;

},{}],6:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var blacklistedKeys = {
	$window: true,
	$console: true,
	$parent: true,
	$self: true,
	$frames: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
			try {
				equalsConstructorPrototype(window[k]);
			} catch (e) {
				return true;
			}
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' && !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (!Object.keys) {
		Object.keys = keysShim;
	} else {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":7}],7:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],8:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module unist:util:visit
 * @fileoverview Utility to recursively walk over unist nodes.
 */

'use strict';

/**
 * Walk forwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   forwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function forwards(values, callback) {
    var index = -1;
    var length = values.length;

    while (++index < length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Walk backwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   backwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function backwards(values, callback) {
    var index = values.length;
    var length = -1;

    while (--index > length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Visit.
 *
 * @param {Node} tree - Root node
 * @param {string} [type] - Node type.
 * @param {function(node): boolean?} callback - Invoked
 *   with each found node.  Can return `false` to stop.
 * @param {boolean} [reverse] - By default, `visit` will
 *   walk forwards, when `reverse` is `true`, `visit`
 *   walks backwards.
 */
function visit(tree, type, callback, reverse) {
    var iterate;
    var one;
    var all;

    if (typeof type === 'function') {
        reverse = callback;
        callback = type;
        type = null;
    }

    iterate = reverse ? backwards : forwards;

    /**
     * Visit `children` in `parent`.
     */
    all = function (children, parent) {
        return iterate(children, function (child, index) {
            return child && one(child, index, parent);
        });
    };

    /**
     * Visit a single node.
     */
    one = function (node, index, parent) {
        var result;

        index = index || (parent ? 0 : null);

        if (!type || node.type === type) {
            result = callback(node, index, parent || null);
        }

        if (node.children && result !== false) {
            return all(node.children, node);
        }

        return result;
    };

    one(tree);
}

/*
 * Expose.
 */

module.exports = visit;

},{}]},{},[1])(1)
});