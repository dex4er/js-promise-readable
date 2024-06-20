import {Readable} from "stream"

export class MockStreamReadable extends Readable {
  readable = true

  _closed = false
  destroyed = false

  ended = false
  paused = false

  private buffer = Buffer.alloc(0)

  private encoding?: BufferEncoding
  private error?: Error
  private nonEmpty?: boolean

  // @ts-expect-error in mock class
  get closed() {
    return this._closed
  }

  read(size: number = 1024): any {
    if (this.error) {
      this.emit("error", this.error)
      return null
    }
    if (!this.nonEmpty) {
      if (!this.ended) {
        this.ended = true
        this.emit("end")
      }
      return null
    }
    const chunk = this.buffer.slice(0, size)
    this.buffer = this.buffer.slice(size)
    return this.encoding ? chunk.toString(this.encoding) : chunk
  }
  close(): void {
    this._closed = true
  }
  destroy(_error?: Error): this {
    this.destroyed = true
    return this
  }
  pause(): this {
    this.paused = true
    return this
  }
  resume(): this {
    this.paused = false
    return this
  }
  setEncoding(encoding: BufferEncoding): this {
    this.encoding = encoding
    return this
  }
  append(chunk: Buffer): void {
    this.nonEmpty = true
    this.buffer = Buffer.concat([this.buffer, chunk])
  }
  setError(err: Error): void {
    this.error = err
  }
}
