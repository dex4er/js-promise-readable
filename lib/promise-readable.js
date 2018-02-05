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
          removeListeners()
          resolve(chunk)
        }
      }

      const closeHandler = () => {
        removeListeners()
        resolve(stream.bytesWritten || 0)
      }

      const endHandler = () => {
        removeListeners()
        resolve()
      }

      const errorHandler = (err) => {
        delete this._errored
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
        removeListeners()
        resolve(stream.bytesWritten || 0)
      }

      const endHandler = () => {
        removeListeners()
        resolve(Buffer.concat(bufferArray))
      }

      const errorHandler = (err) => {
        delete this._errored
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
        removeListeners()
        resolve()
      }

      const eventHandler = event !== 'close' && event !== 'end' && event !== 'error' ? (argument) => {
        removeListeners()
        resolve(argument)
      } : undefined

      const endHandler = event !== 'close' ? () => {
        removeListeners()
        resolve()
      } : undefined

      const errorHandler = (err) => {
        delete this._errored
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

  setEncoding (encoding) {
    this.stream.setEncoding(encoding)
    return this
  }

  destroy () {
    if (this.stream) {
      if (this._errorHandler) {
        this.stream.removeListener('error', this._errorHandler)
        delete this._errorHandler
      }
      if (typeof this.stream.destroy === 'function') {
        this.stream.destroy()
      }
      delete this.stream
    }
  }
}

PromiseReadable.PromiseReadable = PromiseReadable
PromiseReadable.default = PromiseReadable

module.exports = PromiseReadable
