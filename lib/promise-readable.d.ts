export declare class PromiseReadable<TReadable extends NodeJS.ReadableStream> {
  readonly stream: TReadable

  constructor (stream: TReadable)

  read (size?: number): Promise<Buffer | undefined>
  readAll (): Promise<Buffer | undefined>

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadable
