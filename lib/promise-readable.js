'use strict'

class PromiseReadable {
  constructor (stream) {
    this.stream = stream

    this._errorHandler = (err) => {
      this._errored = err
    }

    stream.on('error', this._errorHandler)
  }

  read (size) {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        delete this._errored
        return reject(err)
      }

      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const readableHandler = () => {
        let chunk = stream.read(size)

        if (chunk != null) {
          stream.removeListener('close', closeHandler)
          stream.removeListener('error', errorHandler)
          stream.removeListener('end', endHandler)
          stream.removeListener('readable', readableHandler)
          resolve(chunk)
        }
      }

      const closeHandler = () => {
        stream.removeListener('end', endHandler)
        stream.removeListener('error', errorHandler)
        stream.removeListener('readable', readableHandler)
        resolve(stream.bytesWritten || 0)
      }

      const endHandler = () => {
        stream.removeListener('close', closeHandler)
        stream.removeListener('error', errorHandler)
        stream.removeListener('readable', readableHandler)
        resolve()
      }

      const errorHandler = (err) => {
        delete this._errored
        stream.removeListener('close', closeHandler)
        stream.removeListener('end', endHandler)
        stream.removeListener('readable', readableHandler)
        reject(err)
      }

      stream.once('close', closeHandler)
      stream.once('end', endHandler)
      stream.once('error', errorHandler)
      stream.on('readable', readableHandler)

      readableHandler()
    })
  }

  readAll () {
    const stream = this.stream
    const bufferArray = []

    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        delete this._errored
        return reject(err)
      }

      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const dataHandler = (chunk) => {
        bufferArray.push(chunk)
      }

      const closeHandler = () => {
        stream.removeListener('data', dataHandler)
        stream.removeListener('end', endHandler)
        stream.removeListener('error', errorHandler)
        resolve(stream.bytesWritten || 0)
      }

      const endHandler = () => {
        stream.removeListener('close', closeHandler)
        stream.removeListener('data', dataHandler)
        stream.removeListener('error', errorHandler)
        resolve(Buffer.concat(bufferArray))
      }

      const errorHandler = (err) => {
        delete this._errored
        stream.removeListener('close', closeHandler)
        stream.removeListener('data', dataHandler)
        stream.removeListener('end', endHandler)
        reject(err)
      }

      stream.once('close', closeHandler)
      stream.on('data', dataHandler)
      stream.once('end', endHandler)
      stream.once('error', errorHandler)

      stream.resume()
    })
  }

  once (event) {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        delete this._errored
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
        if (eventHandler) {
          stream.removeListener(event, eventHandler)
        }
        stream.removeListener('error', errorHandler)
        if (endHandler) {
          stream.removeListener('end', endHandler)
        }
        resolve()
      }

      const eventHandler = event !== 'close' && event !== 'end' && event !== 'error' ? (argument) => {
        stream.removeListener('close', closeHandler)
        stream.removeListener('error', errorHandler)
        if (endHandler) {
          stream.removeListener('end', endHandler)
        }
        resolve(argument)
      } : undefined

      const endHandler = event !== 'close' ? () => {
        if (eventHandler) {
          stream.removeListener(event, eventHandler)
        }
        stream.removeListener('close', closeHandler)
        stream.removeListener('error', errorHandler)
        resolve()
      } : undefined

      const errorHandler = (err) => {
        delete this._errored
        if (eventHandler) {
          stream.removeListener(event, eventHandler)
        }
        stream.removeListener('close', closeHandler)
        if (endHandler) {
          stream.removeListener('end', endHandler)
        }
        reject(err)
      }

      if (eventHandler) {
        stream.once(event, eventHandler)
      }
      stream.once('close', closeHandler)
      if (endHandler) {
        stream.once('end', endHandler)
      }
      stream.once('error', errorHandler)
    })
  }

  destroy () {
    this.stream.removeListener('error', this._errorHandler)
    if (typeof this.stream.destroy === 'function') {
      this.stream.destroy()
    }
    delete this.stream
  }
}

PromiseReadable.PromiseReadable = PromiseReadable
PromiseReadable.default = PromiseReadable

module.exports = PromiseReadable
