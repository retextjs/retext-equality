'use strict';

var range = require('mdast-util-heading-range');
var u = require('unist-builder');
var patterns = require('../lib/patterns');

module.exports = table;

function table() {
  return transformer;
}

function transformer(tree) {
  range(tree, 'list of rules', function (start, nodes, end) {
    var rows = [
      u('tableRow', [
        u('tableCell', [u('text', 'id')]),
        u('tableCell', [u('text', 'type')]),
        u('tableCell', [u('text', 'not ok')]),
        u('tableCell', [u('text', 'ok')])
      ])
    ];

    patterns.forEach(function (pattern) {
      rows.push(u('tableRow', [
        u('tableCell', [u('inlineCode', pattern.id)]),
        u('tableCell', [u('link', {url: '#' + pattern.type}, [u('text', pattern.type)])]),
        u('tableCell', renderCell(pattern.inconsiderate, pattern.categories.length > 1)),
        u('tableCell', renderCell(pattern.considerate))
      ]));
    });

    return [start].concat(u('table', rows), end);
  });
}

function renderCell(phrases, includeCategories) {
  var result = [];

  Object.keys(phrases).forEach(function (value, index, values) {
    result.push(u('inlineCode', value));

    if (includeCategories) {
      result.push(u('text', ' (' + phrases[value] + ')'));
    }

    if (index !== values.length - 1) {
      result.push(u('text', ', '));
    }
  });

  return result;
}
