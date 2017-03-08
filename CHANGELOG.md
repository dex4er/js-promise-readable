# Changelog

## v0.0.2 2017-03-09

  * Listen on `end` event rather than `close`.
  * Use `stream.read()` if stream2 is available.
  * Use `pause`/`resume` to be sure that `end` event won't be missed if stream1
    is available.

## v0.0.1 2017-03-08

  * Initial release
