## promise-readable

[![Build Status](https://secure.travis-ci.org/dex4er/js-promise-readable.svg)](http://travis-ci.org/dex4er/js-promise-readable) [![Coverage Status](https://coveralls.io/repos/github/dex4er/js-promise-readable/badge.svg)](https://coveralls.io/github/dex4er/js-promise-readable) [![npm](https://img.shields.io/npm/v/promise-readable.svg)](https://www.npmjs.com/package/promise-readable)

This module allows to convert `Readable` stream into its promisified version, which returns [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object fulfilled when `data` or `close` events occurred.

### Requirements

This module requires Node >= 4.

### Installation

```shell
npm install promise-readable
```

### Usage

`PromiseReadable` object requires `Readable` object to work:

```js
const PromiseReadable = require('promise-readable')

const rstream = require('fs').createReadStream('/etc/hosts')

const promiseRstream = new PromiseReadable(rstream)
```

Original stream is available with `stream` property:

```js
console.log(promiseRstream.stream.flags)
```

#### read

This method returns `Promise` which is fulfilled when stream can return one
chunk (`data` event) or stream is ended (`close` event).

```js
const chunk = await promiseRstream.read()
```

Promise returns chunk data if something has been read or `null` value if it is
an end of the stream.

```js
for (let chunk; (chunk = await promiseRstream.read()) !== null;) {
  console.log(chunk.length)
}
console.log('stream is ended')
```

#### readAll

This method returns `Promise` which is fulfilled when stream is ended. The
content from the stream is buffered and then Promise returns this concatenated
content.

```js
const content = await promiseRstream.readAll()
```

#### end

This method returns `Promise` which is fulfilled when stream is ended. No value
is returned. It might be used when stream is handled with `data` event directly.

```js
promiseRstream.stream.on('data', chunk => console.log(chunk.length))

await promiseRstream.end()
```

### Promise

This module uses [any-promise](https://www.npmjs.com/package/any-promise) and
any ES6 Promise library or polyfill is supported.

Ie. [bluebird](https://www.npmjs.com/package/bluebird) can be used as Promise
library for this module, if it is registered before.

```js
require('any-promise/register/bluebird')
const PromiseReadable = require('promise-readable')
```

### License

Copyright (c) 2017 Piotr Roszatycki <piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
