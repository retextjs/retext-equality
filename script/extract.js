/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:equality:extract
 * @fileoverview Extract and compile database into JSON.
 */

'use strict';

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
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
    entry.id = position;
    return entry;
}

/*
 * Read.
 */

var gender = read(join(__dirname, 'gender.yml'), 'utf8');
var disabilities = read(join(__dirname, 'disabilities.yml'), 'utf8');
var relationships = read(join(__dirname, 'relationships.yml'), 'utf8');

/*
 * Gather.
 */

var data;

data = [].concat(
    yaml.load(gender),
    yaml.load(disabilities),
    yaml.load(relationships)
);

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
})

/*
 * Patch.
 */

data.forEach(patch);

data.forEach(function (entry) {
    if (entry.type !== 'simple' && entry.categories.length < 2) {
        throw new Error(
            'Use `type: simple` for single entries with one category: ' +
            Object.keys(entry.inconsiderate).join(', ')
        );
    }
});

/*
 * Write.
 */

data = stringify(data, 0, 2) + '\n'

write(join(__dirname, '..', 'lib', 'patterns.json'), data);
