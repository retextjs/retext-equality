# retext-equality [![Build Status](https://img.shields.io/travis/wooorm/retext-equality.svg)](https://travis-ci.org/wooorm/retext-equality) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-equality.svg)](https://codecov.io/github/wooorm/retext-equality)

Warn about possible insensitive, inconsiderate language with
[**retext**](https://github.com/wooorm/retext).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-equality
```

**retext-equality** is also available for
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and
globals module, [uncompressed and compressed](https://github.com/wooorm/retext-equality/releases).

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
    1:1-1:4  warning  `His` may be insensitive, use `Their`, `Theirs`, `Them` instead
  1:31-1:37  warning  `master` / `slave` may be insensitive, use `primary` / `replica` instead

⚠ 2 warnings
```

## API

### `retext.use(equality[, options])`

Adds warnings for possible insensitive, inconsiderate language to the
processed [virtual file](https://github.com/wooorm/vfile)s.

**Parameters**

*   `equality` — This plug-in;

*   `options` (`Object?`, optional):

    *   `ignore` (`Array.<string>`) — List of phrases to _not_ warn about.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
