export declare class PromiseReadable {
  readonly stream: NodeJS.ReadableStream

  constructor (stream: NodeJS.ReadableStream)

  read (size?: number): Promise<Buffer | undefined>
  readAll (): Promise<Buffer | undefined>

  once (event: 'close'): Promise<void>
  once (event: 'end'): Promise<void>
  once (event: 'error'): Promise<void>
  once (event: 'open'): Promise<number>
}

export default PromiseReadable
