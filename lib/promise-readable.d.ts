/// <reference types="node" />

import { Readable } from 'stream'

export declare class PromiseReadable<TReadable extends Readable> {
  readonly stream: TReadable

  constructor (stream: TReadable)

  read (size?: number): Promise<Buffer | string | undefined>
  readAll (): Promise<Buffer | string | undefined>

  setEncoding (encoding: string): this

  destroy (): void

  once (event: 'close' | 'end' | 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadable
