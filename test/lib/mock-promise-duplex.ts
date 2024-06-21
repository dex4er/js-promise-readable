import {Duplex} from "node:stream"

import {PromiseReadable} from "../../src/promise-readable.js"

export class MockPromiseDuplex<TDuplex extends Duplex> extends PromiseReadable<TDuplex> {
  static readonly _isPromiseWritable: boolean = true
  constructor(readonly stream: TDuplex) {
    super(stream as any)
  }
}
