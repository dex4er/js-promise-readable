/// <reference types="node" />

interface ReadableStream extends NodeJS.ReadableStream {
  closed?: boolean
  destroyed?: boolean
  destroy?: () => void
}

export class PromiseReadable<TReadable extends ReadableStream> {
  private errorHandler: (err: Error) => void
  private errored?: Error

  constructor(public readonly stream: TReadable) {
    this.errorHandler = err => {
      this.errored = err
    }

    stream.on('error', this.errorHandler)
  }

  read(size?: number): Promise<Buffer | string | undefined> {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (this.errored) {
        const err = this.errored
        this.errored = undefined
        return reject(err)
      }

      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const readableHandler = () => {
        const chunk = stream.read(size)

        if (chunk) {
          removeListeners()
          resolve(chunk)
        }
      }

      const closeHandler = () => {
        removeListeners()
        resolve()
      }

      const endHandler = () => {
        removeListeners()
        resolve()
      }

      const errorHandler = (err: Error) => {
        this.errored = undefined
        removeListeners()
        reject(err)
      }

      const removeListeners = () => {
        stream.removeListener('close', closeHandler)
        stream.removeListener('error', errorHandler)
        stream.removeListener('end', endHandler)
        stream.removeListener('readable', readableHandler)
      }

      stream.on('close', closeHandler)
      stream.on('end', endHandler)
      stream.on('error', errorHandler)
      stream.on('readable', readableHandler)

      readableHandler()
    })
  }

  readAll(): Promise<Buffer | string | undefined> {
    const stream = this.stream
    const bufferArray: Buffer[] = []
    let content = ''

    return new Promise((resolve, reject) => {
      if (this.errored) {
        const err = this.errored
        this.errored = undefined
        return reject(err)
      }

      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const dataHandler = (chunk: Buffer | string) => {
        if (typeof chunk === 'string') {
          content += chunk
        } else {
          bufferArray.push(chunk)
        }
      }

      const closeHandler = () => {
        removeListeners()
        resolve()
      }

      const endHandler = () => {
        removeListeners()
        if (bufferArray.length) {
          resolve(Buffer.concat(bufferArray))
        } else {
          resolve(content)
        }
      }

      const errorHandler = (err: Error) => {
        this.errored = undefined
        removeListeners()
        reject(err)
      }

      const removeListeners = () => {
        stream.removeListener('close', closeHandler)
        stream.removeListener('data', dataHandler)
        stream.removeListener('error', errorHandler)
        stream.removeListener('end', endHandler)
      }

      stream.on('close', closeHandler)
      stream.on('data', dataHandler)
      stream.on('end', endHandler)
      stream.on('error', errorHandler)

      stream.resume()
    })
  }

  setEncoding(encoding: string): this {
    this.stream.setEncoding(encoding)
    return this
  }

  destroy(): void {
    if (this.stream) {
      if (this.errorHandler) {
        this.stream.removeListener('error', this.errorHandler)
        delete this.errorHandler
      }
      if (typeof this.stream.destroy === 'function') {
        this.stream.destroy()
      }
    }
  }

  once(event: 'close' | 'end' | 'error'): Promise<void>
  once(event: 'open'): Promise<number>

  once(event: string): Promise<void | number> {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (this.errored) {
        const err = this.errored
        this.errored = undefined
        return reject(err)
      }

      if (stream.closed) {
        if (event === 'close') {
          return resolve()
        } else {
          return reject(new Error(`once ${event} after close`))
        }
      } else if (stream.destroyed) {
        if (event === 'close' || event === 'end') {
          return resolve()
        } else {
          return reject(new Error(`once ${event} after destroy`))
        }
      }

      const closeHandler = () => {
        removeListeners()
        resolve()
      }

      const eventHandler =
        event !== 'close' && event !== 'end' && event !== 'error'
          ? (argument: any) => {
              removeListeners()
              resolve(argument)
            }
          : undefined

      const endHandler =
        event !== 'close'
          ? () => {
              removeListeners()
              resolve()
            }
          : undefined

      const errorHandler = (err: Error) => {
        this.errored = undefined
        removeListeners()
        reject(err)
      }

      const removeListeners = () => {
        if (eventHandler) {
          stream.removeListener(event, eventHandler)
        }
        stream.removeListener('error', errorHandler)
        if (endHandler) {
          stream.removeListener('end', endHandler)
        }
        stream.removeListener('error', errorHandler)
      }

      if (eventHandler) {
        stream.on(event, eventHandler)
      }
      stream.on('close', closeHandler)
      if (endHandler) {
        stream.on('end', endHandler)
      }
      stream.on('error', errorHandler)
    })
  }
}

export default PromiseReadable
