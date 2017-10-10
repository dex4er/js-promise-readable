/// <reference types="node" />

import { Readable } from 'stream'

export declare class PromiseReadable<TReadable extends Readable> {
  readonly stream: TReadable

  constructor (stream: TReadable)

  read (size?: number): Promise<Buffer | undefined>
  readAll (): Promise<Buffer | undefined>

  once (event: 'close' | 'end' | 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadable
