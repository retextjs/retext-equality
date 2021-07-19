import {headingRange} from 'mdast-util-heading-range'
import {u} from 'unist-builder'
import {patterns} from '../lib/en.js'

export default function table() {
  return transformer
}

function transformer(tree) {
  headingRange(tree, 'list of rules', function (start, nodes, end) {
    var rows = [
      u('tableRow', [
        u('tableCell', [u('text', 'id')]),
        u('tableCell', [u('text', 'type')]),
        u('tableCell', [u('text', 'not ok')]),
        u('tableCell', [u('text', 'ok')])
      ])
    ]

    let index = -1
    while (++index < patterns.length) {
      const pattern = patterns[index]
      rows.push(
        u('tableRow', [
          u('tableCell', [u('inlineCode', pattern.id)]),
          u('tableCell', [
            u('link', {url: '#' + pattern.type}, [u('text', pattern.type)])
          ]),
          u(
            'tableCell',
            renderCell(pattern.inconsiderate, pattern.categories.length > 1)
          ),
          u('tableCell', renderCell(pattern.considerate))
        ])
      )
    }

    return [start].concat(u('table', rows), end)
  })
}

function renderCell(phrases, includeCategories) {
  var result = []
  const values = Object.keys(phrases || {})
  let index = -1

  while (++index < values.length) {
    const value = values[index]
    result.push(u('inlineCode', value))

    if (includeCategories) {
      result.push(u('text', ' (' + phrases[value] + ')'))
    }

    if (index !== values.length - 1) {
      result.push(u('text', ', '))
    }
  }

  return result
}
