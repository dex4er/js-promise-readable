## promise-readable

[![Build Status](https://secure.travis-ci.org/dex4er/js-promise-readable.svg)](http://travis-ci.org/dex4er/js-promise-readable) [![Coverage Status](https://coveralls.io/repos/github/dex4er/js-promise-readable/badge.svg)](https://coveralls.io/github/dex4er/js-promise-readable) [![npm](https://img.shields.io/npm/v/promise-readable.svg)](https://www.npmjs.com/package/promise-readable)

This module allows to convert
[`Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable)
stream into its promisified version, which returns [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object fulfilled when
[`open`](https://nodejs.org/api/fs.html#fs_event_open),
[`data`](https://nodejs.org/api/stream.html#stream_event_data),
[`close`](https://nodejs.org/api/fs.html#fs_event_close),
[`end`](https://nodejs.org/api/stream.html#stream_event_end) or
[`error`](https://nodejs.org/api/stream.html#stream_event_error_1) events
occurred.

### Requirements

This module requires Node >= 4.

### Installation

```shell
npm install promise-readable
```

### Usage

#### constructor

```js
const promiseReadable = new PromiseReadable(stream)
```

`PromiseReadable` object requires `Readable` object to work.

_Example:_

```js
const { PromiseReadable } = require('promise-readable')
const { createReadStream } = require('fs')

const stream = createReadStream('/etc/hosts')
const promiseReadable = new PromiseReadable(stream)
```

_Typescript:_

```js
import { PromiseReadable } from 'promise-readable'
import { createReadStream } from 'fs'

const stream = createReadStream('/etc/hosts')
const promiseReadable = new PromiseReadable(stream)
```

#### stream

```js
const stream = promiseReadable.stream
```

Original stream object.

_Example:_

```js
console.log(promiseReadable.stream.flags)
```

#### read

```js
const chunk = await promiseReadable.read(chunkSize)
```

This method returns `Promise` which is fulfilled when stream can return one
chunk (by `read` method or `data` event) or stream is ended (`end` event).

If stream2 API is available then additional argument `size` is accepted.

_Example:_

```js
const chunk = await promiseReadable.read(1024)
```

Promise returns chunk data if something has been read or `undefined` value if
it is an end of the stream.

_Example:_

```js
for (let chunk; (chunk = await promiseReadable.read()) != null;) {
  console.log(chunk.length)
}
console.log('stream is ended')
```

#### readAll

```js
const content = await promiseReadable.readAll()
```

This method returns `Promise` which is fulfilled when stream is ended or
`undefined` value if stream is already ended. The content from the stream is
buffered and then Promise returns this concatenated content.

#### once

```js
const result = await promiseReadable.once(event)
```

This method returns `Promise` which is fulfilled when stream emits `event`. The
result of this event is returned or `undefined` value if stream is already
ended.

The promise will reject on error.

_Example:_

```js
const fd = await promiseReadable.once('open')
promiseReadable.stream.pipe(process.stdout)

await promiseReadable.once('close')

promiseReadable.stream.on('data', chunk => console.log(chunk.length))
await promiseReadable.once('end')

await promiseReadable.once('error') // undefined if already ended or throws error
```

### Promise

This module uses [any-promise](https://www.npmjs.com/package/any-promise) and
any ES6 Promise library or polyfill is supported.

Ie. [bluebird](https://www.npmjs.com/package/bluebird) can be used as Promise
library for this module, if it is registered before.

```js
require('any-promise/register/bluebird')
const { PromiseReadable } = require('promise-readable')
```

### License

Copyright (c) 2017 Piotr Roszatycki <piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
