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
var equality = require('retext-equality');
var doc = 'His network was set up with a master and slave.';

retext().use(equality).process(doc, function (err, file) {
    if (err) throw err;
    console.log(file.messages.map(String));
    /*
     * [
     *   '1:1-1:4: `His` may be insensitive, use `Their`, `Theirs` instead',
     *   '1:31-1:37: `master` / `slave` may be insensitive, use `primary` / `replica` instead'
     * ]
     */
});
```

## API

### [retext](https://github.com/wooorm/retext/tree/feature/stable#api).[use](https://github.com/wooorm/retext/tree/feature/stable#retextuseplugin-options)(equality)

Adds warnings for possible insensitive, inconsiderate language to processed [virtual file](https://github.com/wooorm/vfile)s.

**Parameters**

*   `equality` — This plug-in.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
