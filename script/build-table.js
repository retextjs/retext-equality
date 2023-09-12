/**
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').TableRow} TableRow
 */

import {headingRange} from 'mdast-util-heading-range'
import {patterns} from '../lib/patterns-en.js'

/**
 * @returns
 *   Transform.
 */
export default function remarkBuildTable() {
  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    headingRange(tree, 'list of rules', function (start, _, end) {
      /** @type {Array<TableRow>} */
      const rows = [
        {
          type: 'tableRow',
          children: [
            {type: 'tableCell', children: [{type: 'text', value: 'id'}]},
            {type: 'tableCell', children: [{type: 'text', value: 'type'}]},
            {type: 'tableCell', children: [{type: 'text', value: 'not ok'}]},
            {type: 'tableCell', children: [{type: 'text', value: 'ok'}]}
          ]
        }
      ]

      let index = -1
      while (++index < patterns.length) {
        const pattern = patterns[index]

        rows.push({
          type: 'tableRow',
          children: [
            {
              type: 'tableCell',
              children: [{type: 'inlineCode', value: pattern.id}]
            },
            {
              type: 'tableCell',
              children: [
                {
                  type: 'link',
                  url: '#' + pattern.type,
                  children: [{type: 'text', value: pattern.type}]
                }
              ]
            },
            {
              type: 'tableCell',
              children: createCell(
                pattern.inconsiderate,
                pattern.categories.length > 1
              )
            },
            {type: 'tableCell', children: createCell(pattern.considerate)}
          ]
        })
      }

      return [start, {type: 'table', children: rows}, end]
    })
  }
}

/**
 * @param {Readonly<Record<string, string>> | undefined} phrases
 *   Phrases.
 * @param {boolean | undefined} [includeCategories=false]
 *   Whether to include categories (default: `false`).
 * @returns {Array<PhrasingContent>}
 *   Result.
 */
function createCell(phrases, includeCategories) {
  const map = phrases || {}
  const values = Object.keys(map)
  let index = -1
  /** @type {Array<PhrasingContent>} */
  const result = []

  while (++index < values.length) {
    const value = values[index]

    result.push({type: 'inlineCode', value})

    if (includeCategories) {
      result.push({type: 'text', value: ' (' + map[value] + ')'})
    }

    if (index !== values.length - 1) {
      result.push({type: 'text', value: ', '})
    }
  }

  return result
}
