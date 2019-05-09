import {Duplex} from 'stream'

import {PromiseReadable} from '../../src/promise-readable'

import {MockPromiseWritable} from './mock-promise-writable'

export class MockPromiseDuplex<TDuplex extends Duplex> extends PromiseReadable<TDuplex>
  implements MockPromiseWritable<TDuplex> {
  readonly isPromiseWritable: boolean = true
  constructor(readonly stream: TDuplex) {
    super(stream as any)
  }
  async write(_chunk: string | Buffer, _encoding?: string): Promise<number> {
    return 0
  }
  async writeAll(_content: string | Buffer, _chunkSize: number = 64 * 1024): Promise<number> {
    return 0
  }
  async end(): Promise<void> {
    return
  }
  destroy(): void {
    return
  }
}
