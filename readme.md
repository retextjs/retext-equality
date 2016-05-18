# retext-equality [![Build Status][travis-badge]][travis] [![Coverage Status][coverage-badge]][coverage]

Warn about possible insensitive, inconsiderate language with
[**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-equality
```

**retext-equality** is also available as an AMD, CommonJS, and globals
module, [uncompressed and compressed][releases].

## Usage

```js
var retext = require('retext');
var report = require('vfile-reporter');
var equality = require('retext-equality');

retext()
    .use(equality)
    .process([
        'His network was set up with a master and slave.'
    ].join('\n'), function (err, file) {
        console.log(report(file));
    });
```

Yields:

```text
<stdin>
    1:1-1:4  warning  `His` may be insensitive, use `Their`, `Theirs`, `Them` instead           her-him
  1:31-1:37  warning  `master` / `slave` may be insensitive, use `primary` / `replica` instead  master-slave

⚠ 2 warnings
```

## API

### `retext.use(equality[, options])`

Adds warnings for possible insensitive, inconsiderate language to the
processed [virtual file][vfile]s.

**Parameters**

*   `equality` — This plug-in;

*   `options` (`Object?`, optional):

    *   `ignore` (`Array.<string>`)
        — List of phrases to _not_ warn about;

    *   `noBinary` (`boolean`, default: `false`)
        — Do not allow binary references. By default `he` is warned
        about unless it’s followed by something like `or she` or `and she`.
        When `noBinary` is `true`, both cases would be warned about.

## Contributing

Thanks, contributions are greatly appreciated! :+1:
If you add new patterns, add them in the YAML files in
the [`script/`][script] directory, and execute `npm install` and
then `npm test` to build everything.

Please see the current patterns for inspiration.

## License

[MIT][license] © [Titus Wormer][home]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-equality.svg

[travis]: https://travis-ci.org/wooorm/retext-equality

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-equality.svg

[coverage]: https://codecov.io/github/wooorm/retext-equality

[npm-install]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/retext-equality/releases

[license]: LICENSE

[script]: script

[home]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[vfile]: https://github.com/wooorm/vfile
