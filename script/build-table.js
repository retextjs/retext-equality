import {headingRange} from 'mdast-util-heading-range'
import {u} from 'unist-builder'
import {patterns} from '../lib/en.js'

/** @type {import('unified').Plugin<[]>} */
export default function table() {
  return (tree) => {
    headingRange(tree, 'list of rules', (start, _, end) => {
      /** @type {import('mdast').TableRow[]} */
      const rows = [
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

      return [start, u('table', rows), end]
    })
  }
}

/**
 * @param {Record<string, string>|undefined} phrases
 * @param {boolean} [includeCategories]
 */
function renderCell(phrases, includeCategories) {
  const map = phrases || {}
  const values = Object.keys(map)
  let index = -1
  /** @type {import('mdast').PhrasingContent[]} */
  const result = []

  while (++index < values.length) {
    const value = values[index]
    result.push(u('inlineCode', value))

    if (includeCategories) {
      result.push(u('text', ' (' + map[value] + ')'))
    }

    if (index !== values.length - 1) {
      result.push(u('text', ', '))
    }
  }

  return result
}
