# retext-equality [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Warn about possible insensitive, inconsiderate language with
[**retext**][retext].

## Installation

[npm][]:

```bash
npm install retext-equality
```

## Usage

```js
var retext = require('retext');
var report = require('vfile-reporter');
var equality = require('retext-equality');

var file = retext()
  .use(equality)
  .processSync('His network was set up with a master and slave.');

console.log(report(file));
```

Yields:

```text
<stdin>
    1:1-1:4  warning  `His` may be insensitive, use `Their`, `Theirs`, `Them` instead           her-him
  1:31-1:37  warning  `master` / `slave` may be insensitive, use `primary` / `replica` instead  master-slave

⚠ 2 warnings
```

## API

### `retext().use(equality[, options])`

Adds warnings for possible insensitive, inconsiderate language to the
processed [virtual file][vfile]s.

###### `options`

*   `ignore` (`Array.<string>`) — List of phrases _not_ to warn about;
*   `noBinary` (`boolean`, default: `false`) — Do not allow binary
    references.  By default `he` is warned about unless it’s followed
    by something like `or she` or `and she`.  When `noBinary` is `true`,
    both cases would be warned about.

## Contributing

Thanks, contributions are greatly appreciated!  :+1:  If you add new
patterns, add them in the YAML files in the [`script/`][script]
directory, and run `npm install` and then `npm test` to build
everything.

Please see the current patterns for inspiration.

## Rules

See [`rules.md`][rules] for a list of rules.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-equality.svg

[travis]: https://travis-ci.org/wooorm/retext-equality

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-equality.svg

[codecov]: https://codecov.io/github/wooorm/retext-equality

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[vfile]: https://github.com/wooorm/vfile

[script]: script

[rules]: rules.md
