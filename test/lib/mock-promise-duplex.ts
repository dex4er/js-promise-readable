import {Duplex} from "stream"

import {PromiseReadable} from "../../src/promise-readable"

export class MockPromiseDuplex<TDuplex extends Duplex> extends PromiseReadable<TDuplex> {
  static readonly _isPromiseWritable: boolean = true
  constructor(readonly stream: TDuplex) {
    super(stream as any)
  }
}
