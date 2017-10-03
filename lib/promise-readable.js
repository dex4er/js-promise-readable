'use strict'

const Promise = require('any-promise')

class PromiseReadable {
  constructor (stream) {
    this.stream = stream
  }

  read (size) {
    return typeof this.stream.read === 'function' ? this._read2(size) : this._read1()
  }

  _read1 () {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const onceClose = () => {
        stream.removeListener('data', onceData)
        stream.removeListener('end', onceEnd)
        stream.removeListener('error', onceError)
        resolve(stream.bytesWritten || 0)
      }

      const onceData = (chunk) => {
        stream.pause()
        stream.removeListener('close', onceClose)
        stream.removeListener('end', onceEnd)
        stream.removeListener('error', onceError)
        resolve(chunk)
      }

      const onceEnd = () => {
        stream.removeListener('close', onceClose)
        stream.removeListener('data', onceData)
        stream.removeListener('error', onceError)
        resolve()
      }

      const onceError = (err) => {
        stream.removeListener('close', onceClose)
        stream.removeListener('data', onceData)
        stream.removeListener('end', onceEnd)
        reject(err)
      }

      stream.once('close', onceClose)
      stream.once('data', onceData)
      stream.once('end', onceEnd)
      stream.once('error', onceError)
      stream.resume()
    })
  }

  _read2 (size) {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const onReadable = () => {
        let chunk = stream.read(size)

        if (chunk != null) {
          stream.removeListener('close', onceClose)
          stream.removeListener('error', onceError)
          stream.removeListener('end', onceEnd)
          stream.removeListener('readable', onReadable)
          resolve(chunk)
        }
      }

      const onceClose = () => {
        stream.removeListener('end', onceEnd)
        stream.removeListener('error', onceError)
        stream.removeListener('readable', onReadable)
        resolve(stream.bytesWritten || 0)
      }

      const onceEnd = () => {
        stream.removeListener('close', onceClose)
        stream.removeListener('error', onceError)
        stream.removeListener('readable', onReadable)
        resolve()
      }

      const onceError = (err) => {
        stream.removeListener('close', onceClose)
        stream.removeListener('end', onceEnd)
        stream.removeListener('readable', onReadable)
        reject(err)
      }

      stream.once('close', onceClose)
      stream.on('readable', onReadable)
      stream.once('end', onceEnd)
      stream.once('error', onceError)

      onReadable()
    })
  }

  readAll () {
    const stream = this.stream
    const bufferArray = []

    return new Promise((resolve, reject) => {
      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const onData = (chunk) => {
        bufferArray.push(chunk)
      }

      const onceClose = () => {
        stream.removeListener('data', onData)
        stream.removeListener('end', onceEnd)
        stream.removeListener('error', onceError)
        resolve(stream.bytesWritten || 0)
      }

      const onceEnd = () => {
        stream.removeListener('close', onceClose)
        stream.removeListener('data', onData)
        stream.removeListener('error', onceError)
        resolve(Buffer.concat(bufferArray))
      }

      const onceError = (err) => {
        stream.removeListener('close', onceClose)
        stream.removeListener('data', onData)
        stream.removeListener('end', onceEnd)
        reject(err)
      }

      stream.once('close', onceClose)
      stream.on('data', onData)
      stream.once('end', onceEnd)
      stream.once('error', onceError)
    })
  }

  once (event) {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (this._errored) {
        return reject(this._errored)
      } else if (stream.closed) {
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

      const onceClose = () => {
        if (onceEvent) {
          stream.removeListener(event, onceEvent)
        }
        stream.removeListener('error', onceError)
        if (onceEnd) {
          stream.removeListener('end', onceEnd)
        }
        resolve()
      }

      const onceEvent = event !== 'close' && event !== 'end' && event !== 'error' ? (argument) => {
        stream.removeListener('close', onceClose)
        stream.removeListener('error', onceError)
        if (onceEnd) {
          stream.removeListener('end', onceEnd)
        }
        resolve(argument)
      } : undefined

      const onceEnd = event !== 'close' ? () => {
        if (onceEvent) {
          stream.removeListener(event, onceEvent)
        }
        stream.removeListener('close', onceClose)
        stream.removeListener('error', onceError)
        resolve()
      } : undefined

      const onceError = (err) => {
        if (onceEvent) {
          stream.removeListener(event, onceEvent)
        }
        stream.removeListener('close', onceClose)
        if (onceEnd) {
          stream.removeListener('end', onceEnd)
        }
        this._errored = err
        reject(err)
      }

      if (onceEvent) {
        stream.once(event, onceEvent)
      }
      stream.once('close', onceClose)
      if (onceEnd) {
        stream.once('end', onceEnd)
      }
      stream.once('error', onceError)
    })
  }
}

PromiseReadable.PromiseReadable = PromiseReadable
PromiseReadable.default = PromiseReadable

module.exports = PromiseReadable
