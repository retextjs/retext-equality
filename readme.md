# retext-equality

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to check for possible insensitive, inconsiderate
language.

## Install

[npm][]:

```sh
npm install retext-equality
```

## Use

Say we have the following file, `example.txt`:

```txt
He’s pretty set on beating your butt for sheriff.
```

…and our script, `example.js`, looks like this:

```js
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var english = require('retext-english')
var stringify = require('retext-stringify')
var equality = require('retext-equality')

unified()
  .use(english)
  .use(equality)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function (err, file) {
    console.error(report(err || file))
  })
```

Now, running `node example` yields:

```txt
example.txt
  1:1-1:5  warning  `He’s` may be insensitive, use `They`, `It` instead  he-she  retext-equality

⚠ 1 warning
```

## API

### `retext().use(equality[, options])`

Check for possible insensitive, inconsiderate language.

###### `options.ignore`

List of phrases *not* to warn about (`Array.<string>`).

###### `options.noBinary`

Do not allow binary references (`boolean`, default: `false`).
By default `he` is warned about unless it’s followed by something like `or she`
or `and she`.
When `noBinary` is `true`, both cases would be warned about.

### Messages

See [`rules.md`][rules] for a list of rules and how rules work.

Each message is emitted as a [`VFileMessage`][message] on `file`, with the
following fields:

###### `message.source`

Name of this plugin (`'retext-equality'`).

###### `message.ruleId`

See `id` in [`rules.md`][rules].

###### `message.actual`

Current not ok phrase (`string`).

###### `message.expected`

Suggest ok phrase (`Array.<string>`).

###### `message.note`

Extra information, when available (`string?`).

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

To create new patterns, add them in the YAML files in the [`data/`][script]
directory, and run `npm install` and then `npm test` to build everything.
Please see the current patterns for inspiration.
New English rules will be automatically added to `rules.md`.

Once you are happy with the new rule, add a test for it in [`test.js`][test] and
open a pull request.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-equality.svg

[build]: https://travis-ci.org/retextjs/retext-equality

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-equality.svg

[coverage]: https://codecov.io/github/retextjs/retext-equality

[downloads-badge]: https://img.shields.io/npm/dm/retext-equality.svg

[downloads]: https://www.npmjs.com/package/retext-equality

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-equality.svg

[size]: https://bundlephobia.com/result?p=retext-equality

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/retextjs/.github/blob/HEAD/support.md

[coc]: https://github.com/retextjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[message]: https://github.com/vfile/vfile-message

[script]: script

[test]: test.js

[rules]: rules.md
