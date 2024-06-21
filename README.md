# promise-readable

<!-- markdownlint-disable MD013 -->

[![GitHub](https://img.shields.io/github/v/release/dex4er/js-promise-readable?display_name=tag&sort=semver)](https://github.com/dex4er/js-promise-readable)
[![CI](https://github.com/dex4er/js-promise-readable/actions/workflows/ci.yaml/badge.svg)](https://github.com/dex4er/js-promise-readable/actions/workflows/ci.yaml)
[![Trunk Check](https://github.com/dex4er/js-promise-readable/actions/workflows/trunk.yaml/badge.svg)](https://github.com/dex4er/js-promise-readable/actions/workflows/trunk.yaml)
[![Coverage Status](https://coveralls.io/repos/github/dex4er/js-promise-readable/badge.svg)](https://coveralls.io/github/dex4er/js-promise-readable)
[![npm](https://img.shields.io/npm/v/promise-readable.svg)](https://www.npmjs.com/package/promise-readable)

<!-- markdownlint-enable MD013 -->

This module allows to convert
[`Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable)
stream into its promisified version, which returns
[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object fulfilled when [`open`](https://nodejs.org/api/fs.html#fs_event_open),
[`data`](https://nodejs.org/api/stream.html#stream_event_data),
[`close`](https://nodejs.org/api/fs.html#fs_event_close),
[`end`](https://nodejs.org/api/stream.html#stream_event_end) or
[`error`](https://nodejs.org/api/stream.html#stream_event_error_1) events
occurred.

The promisified stream provides an async iterator so it is possible to use it
with [`for await...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
statement.

## Requirements

This module requires Node >= 16.

## Installation

```shell
npm install promise-readable
```

_Additionally for Typescript:_

```shell
npm install -D @types/node
```

## Usage

```js
import PromiseReadable from "promise-readable"
```

### constructor

```js
const promiseReadable = new PromiseReadable(stream)
```

`PromiseReadable` object requires `Readable` object to work.

_Example:_

```js
import fs from "node:fs"
import PromiseReadable from "promise-readable"

const stream = fs.createReadStream("/etc/hosts")
const promiseReadable = new PromiseReadable(stream)
```

### stream

```js
const stream = promiseReadable.stream
```

Original stream object.

_Example:_

```js
console.log(promiseReadable.stream.flags)
```

### read

```js
const chunk = await promiseReadable.read(chunkSize)
```

This method returns `Promise` which is fulfilled when the stream can return
one chunk (by `read` method or `data` event) or the stream is ended (`end` or
`close` events).

_Example:_

```js
const chunk = await promiseReadable.read(1024)
```

Promise returns chunk data if something has been read or `undefined` value if
it is an end of the stream.

_Example:_

```js
for (let chunk; (chunk = await promiseReadable.read()); ) {
  console.log(chunk.length)
}
console.log("stream is ended")
```

### readAll

```js
const content = await promiseReadable.readAll()
```

This method returns `Promise` which is fulfilled when the stream is ended or
closed. It is resolved to `undefined` value if the stream is already ended or
closed.

The content from the stream is buffered and then `Promise` returns this
concatenated content.

### setEncoding

```js
promiseReadable = promiseReadable.setEncoding(encoding)
```

By default `read` and `readAll` methods return `Buffer` objects.

This method sets the character encoding for data read from the stream. It
might be used if the original stream does not provide `encoding` option.

The method returns this object.

_Example:_

```js
const asBuffer = await promiseReadable.read()

promiseReadable.setEncoding("utf8")
const asString = await promiseReadable.read()
```

### once

```js
const result = await promiseReadable.once(event)
```

This method returns `Promise` which is fulfilled when the stream emits
`event`. The result of this event is returned or `undefined`` value if the
stream has already ended.

The promise will be rejected on error.

_Example:_

```js
const fd = await promiseReadable.once("open")
promiseReadable.stream.pipe(process.stdout)

await promiseReadable.once("close")

promiseReadable.stream.on("data", chunk => console.log(chunk.length))
await promiseReadable.once("end")

await promiseReadable.once("error") // throws error, undefined if ended
```

### iterate

```js
for await (const chunk of promiseReadable.iterate(chunkSize)) {
}
```

This method returns an async iterator which returns the content of the stream
chunk-by-chunk with a defined `chunkSize`.

### Symbol.asyncIterator

```js
for await (const chunk of promiseReadable) {
}
```

The `PromiseReadable` object is an async iterator that returns the content of
the stream chunk-by-chunk with the default `chunkSize`.

### destroy

```js
promiseReadable = promiseReadable.destroy()
```

This method calls `destroy` method on stream and cleans up all own handlers.

The method returns this object.

## See also

[`PromiseWritable`](https://www.npmjs.com/package/promise-writable),
[`PromiseDuplex`](https://www.npmjs.com/package/promise-duplex),
[`PromiseSocket`](https://www.npmjs.com/package/promise-socket),
[`PromisePiping`](https://www.npmjs.com/package/promise-piping).

## License

Copyright (c) 2017-2024 Piotr Roszatycki <mailto:piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
