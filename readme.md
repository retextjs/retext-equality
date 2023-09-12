# retext-equality

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to check for possible insensitive, inconsiderate language.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(retextEquality[, options])`](#unifieduseretextequality-options)
    *   [`Options`](#options)
*   [Messages](#messages)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contributing](#contributing)
*   [License](#license)

## What is this?

This package is a [unified][] ([retext][]) plugin to check for certain words
that could be considered insensitive, or otherwise inconsiderate, in certain
contexts.

## When should I use this?

You can opt-into this plugin when you’re dealing with your own text and want to
check for potential mistakes.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install retext-equality
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextEquality from 'https://esm.sh/retext-equality@6'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextEquality from 'https://esm.sh/retext-equality@6?bundle'
</script>
```

## Use

Say our document `example.txt` contains:

```txt
Now that the child elements are floated, obviously the parent element will collapse.
```

…and our module `example.js` contains:

```js
import retextEnglish from 'retext-english'
import retextEquality from 'retext-equality'
import retextStringify from 'retext-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await unified()
  .use(retextEnglish)
  .use(retextEquality)
  .use(retextStringify)
  .process(await read('example.txt'))

console.error(reporter(file))
```

…then running `node example.js` yields:

```txt
example.txt
1:42-1:51 warning Unexpected potentially insensitive use of `obviously`, try not to use it obvious retext-equality

⚠ 1 warning
```

## API

This package exports no identifiers.
The default export is [`retextEquality`][api-retext-equality].

### `unified().use(retextEquality[, options])`

Check potentially insensitive language.

###### Parameters

*   `options` ([`Options`][api-options], optional)
    — configuration

###### Returns

Transform ([`Transformer`][unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

*   `ignore` (`Array<string>`, optional)
    — phrases *not* to warn about
*   `binary` (`boolean`, default: `false`)
    — whether to allow “he or she”, “garbagemen and garbagewomen”, and similar

## Messages

See [`rules.md`][file-rules] for a list of rules and how rules work.

Each message is emitted as a [`VFileMessage`][vfile-message] with `source` set
to `'retext-equality'`, `ruleId` to an `id` from [`rules.md`][file-rules],
`actual` to the not ok phrase, and `expected` to suggested phrases.
Some messages also contain a `note` with extra info.

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `retext-equality@^7`,
compatible with Node.js 16.

## Related

*   [`alex`](https://github.com/get-alex/alex)
    — Catch insensitive, inconsiderate writing
*   [`retext-passive`](https://github.com/retextjs/retext-passive)
    — Check passive voice
*   [`retext-profanities`](https://github.com/retextjs/retext-profanities)
    — Check for profane and vulgar wording
*   [`retext-simplify`](https://github.com/retextjs/retext-simplify)
    — Check phrases for simpler alternatives

## Contributing

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

To create new patterns, add them in the YAML files in the [`data/`][file-data]
directory, and run `npm install` and then `npm test` to build everything.
Please see the current patterns for inspiration.
New English rules will automatically be added to `rules.md`.

When you are happy with the new rule, add a test for it in
[`test.js`][file-test], and open a pull request.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/retextjs/retext-equality/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-equality/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-equality.svg

[coverage]: https://codecov.io/github/retextjs/retext-equality

[downloads-badge]: https://img.shields.io/npm/dm/retext-equality.svg

[downloads]: https://www.npmjs.com/package/retext-equality

[size-badge]: https://img.shields.io/bundlejs/size/retext-equality

[size]: https://bundlejs.com/?q=retext-equality

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/main/contributing.md

[support]: https://github.com/retextjs/.github/blob/main/support.md

[coc]: https://github.com/retextjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[vfile-message]: https://github.com/vfile/vfile-message

[file-rules]: rules.md

[file-data]: data/

[file-test]: test.js

[api-options]: #options

[api-retext-equality]: #unifieduseretextequality-options
