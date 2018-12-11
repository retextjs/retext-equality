# retext-equality [![Build][build-badge]][build] [![Coverage][coverage-badge]][coverage] [![Downloads][downloads-badge]][downloads] [![Chat][chat-badge]][chat]

Warn about possible insensitive, inconsiderate language with
[**retext**][retext].

## Installation

[npm][]:

```bash
npm install retext-equality
```

## Usage

Say we have the following file, `example.txt`:

```text
He’s pretty set on beating your butt for sheriff.
```

And our script, `example.js`, looks like this:

```javascript
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
  .process(vfile.readSync('example.txt'), function(err, file) {
    console.error(report(err || file))
  })
```

Now, running `node example` yields:

```text
example.txt
    1:1-1:4  warning  `His` may be insensitive, use `Their`, `Theirs`, `Them` instead           her-him       retext-equality
  1:31-1:37  warning  `master` / `slave` may be insensitive, use `primary` / `replica` instead  master-slave  retext-equality

⚠ 2 warnings
```

## API

### `retext().use(equality[, options])`

Adds warnings for possible insensitive, inconsiderate language to the
processed [virtual file][vfile]s.

##### `options`

###### `options.ignore`

`Array.<string>` — List of phrases _not_ to warn about

###### `options.noBinary`

`boolean`, default: `false` — Do not allow binary references.  By default
`he` is warned about unless it’s followed by something like `or she` or
`and she`.  When `noBinary` is `true`, both cases would be warned about.

## Rules

See [`rules.md`][rules] for a list of rules.

## Contributing

Thanks, contributions are greatly appreciated!  :+1:
See [`contributing.md` in `retextjs/retext`][contributing] for ways to get
started.  This organisation has a [Code of Conduct][coc].  By interacting
with this repository, organisation, or community you agree to abide by its
terms.

To create new patterns, add them in the YAML files in the
[`script/`][script] directory, and run `npm install` and then `npm test`
to build everything.  New rules will be automatically added to `rules.md`.
Please see the current patterns for inspiration.

Once you are happy with the new rule, add a test for it in
[`test.js`][test] and open a Pull Request.

## Related

*   [`alex`](https://github.com/get-alex/alex)
    — Catch insensitive, inconsiderate writing
*   [`retext-passive`](https://github.com/retextjs/retext-passive)
    — Check passive voice
*   [`retext-profanities`](https://github.com/retextjs/retext-profanities)
    — Check for profane and vulgar wording
*   [`retext-simplify`](https://github.com/retextjs/retext-simplify)
    — Check phrases for simpler alternatives

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-equality.svg

[build]: https://travis-ci.org/retextjs/retext-equality

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-equality.svg

[coverage]: https://codecov.io/github/retextjs/retext-equality

[downloads-badge]: https://img.shields.io/npm/dm/retext-equality.svg

[downloads]: https://www.npmjs.com/package/retext-equality

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[vfile]: https://github.com/vfile/vfile

[script]: script

[test]: test.js

[rules]: rules.md

[contributing]: https://github.com/retextjs/retext/blob/master/contributing.md

[coc]: https://github.com/retextjs/retext/blob/master/code-of-conduct.md
