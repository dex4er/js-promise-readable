# Changelog

## v0.4.2 2017-03-16

  * Minor tweaks for documentation.

## v0.4.1 2017-03-14

  * `once('error')` is the same as `once('end')`.

## v0.4.0 2017-03-14

  * New method `once` replaces other `once*` methods.

## v0.3.0 2017-03-11

  * Method `end` is renamed to `onceEnd`.

## v0.2.0 2017-03-11

  * Methods `onceOpen` and `onceClose` (with prefix).

## v0.1.0 2017-03-10

  * New methods `open` and `close` for `fs.ReadStream` streams.

## v0.0.2 2017-03-09

  * Listen on `end` event rather than `close`.
  * Use `stream.read()` if stream2 is available.
  * Use `pause`/`resume` to be sure that `end` event won't be missed if stream1
    is available.
  * Do not block on reading of already ended stream.

## v0.0.1 2017-03-08

  * Initial release
