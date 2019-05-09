import {Readable} from 'stream'

export class MockStream extends Readable {
  readable = true

  closed = false
  destroyed = false

  ended = false
  paused = false

  private buffer = Buffer.alloc(0)

  private encoding?: string
  private error?: Error

  read(size: number = 1024): any {
    if (this.error) {
      this.emit('error', this.error)
      return null
    }
    if (this.buffer.length === 0) {
      if (!this.ended) {
        this.ended = true
        this.emit('end')
      }
      return null
    }
    const chunk = this.buffer.slice(0, size)
    this.buffer = this.buffer.slice(size)
    return this.encoding ? chunk.toString(this.encoding) : chunk
  }
  close(): void {
    this.closed = true
  }
  destroy(): void {
    this.destroyed = true
  }
  pause(): this {
    this.paused = true
    return this
  }
  resume(): this {
    this.paused = false
    return this
  }
  setEncoding(encoding: string): this {
    this.encoding = encoding
    return this
  }
  append(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk])
  }
  setError(err: Error): void {
    this.error = err
  }
}
