/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:equality:extract
 * @fileoverview Extract and compile database into JSON.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var duplicated = require('array-duplicated');
var yaml = require('js-yaml');

/*
 * Methods.
 */

var join = path.join;
var read = fs.readFileSync;
var write = fs.writeFileSync;
var stringify = JSON.stringify;

/**
 * Add `position` to `entry` as `id`.
 *
 * @param {Object} entry - Thing.
 * @param {*} position - Identifier.
 */
function patch(entry, position) {
    var description = entry.note;
    var source = entry.source;
    var result = {
        'id': position,
        'type': entry.type,
        'categories': entry.categories,
        'considerate': entry.considerate,
        'inconsiderate': entry.inconsiderate
    };

    if (source) {
        if (description) {
            description += ' (source: ' + source + ')';
        } else {
            description = 'Source: ' + source;
        }
    }

    result.note = description;

    return result;
}

/*
 * Gather.
 */

var data = [
    'gender',
    'ablist',
    'racial',
    'relationships',
    'lgbtq',
    'suicide'
].map(function (name) {
    return yaml.load(read(join(__dirname, name + '.yml'), 'utf8'));
});

data = [].concat.apply([], data);

/**
 * Clean a value.
 *
 * @param {string|Array.<string>|Object} value - Either a
 *   phrase, list of phrases, or a map of phrases mapping
 *   to categories.
 * @return {Object} - Normalized `value`.
 */
function clean(value) {
    var copy;

    if (typeof value === 'string') {
        value = [value];
    }

    if (value.length) {
        copy = value;
        value = {};

        copy.forEach(function (phrase) {
            value[phrase] = 'a' /* example category */;
        });
    }

    return value;
}

data.forEach(function (entry) {
    entry.inconsiderate = clean(entry.inconsiderate);
    entry.considerate = clean(entry.considerate);
    entry.categories = Object.keys(entry.inconsiderate).map(function (key) {
        return entry.inconsiderate[key];
    }).filter(function (value, index, parent) {
        return parent.indexOf(value, index + 1) === -1;
    });
});

/*
 * Patch.
 */

var phrases = [];

data = data.map(patch);

data.forEach(function (entry) {
    if (entry.type !== 'simple' && entry.categories.length < 2) {
        throw new Error(
            'Use `type: simple` for single entries with one category: ' +
            Object.keys(entry.inconsiderate).join(', ')
        );
    }

    if (entry.inconsiderate) {
        Object.keys(entry.inconsiderate).forEach(function (inconsiderate) {
            phrases.push(inconsiderate);

            if (/['’-]/.test(inconsiderate)) {
                throw new Error(
                    'Refrain from using dashes or ampersands ' +
                    'inside inconsiderate terms: they’ll be stripped ' +
                    'when looking for words: ' +
                    Object.keys(entry.inconsiderate).join(', ')
                );
            }
        });
    }
});

var duplicates = duplicated(phrases);

if (duplicates.length) {
    throw new Error(
        'Refrain from multiple entries:\n' +
        '  ' + duplicates.join(', ')
    );
}

/*
 * Write.
 */

data = stringify(data, 0, 2) + '\n';

write(join(__dirname, '..', 'lib', 'patterns.json'), data);
