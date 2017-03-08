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
      if (!stream.readable) {
        return resolve(null)
      }

      stream.once('data', onceData)
      stream.once('end', onceEnd)
      stream.once('error', onceError)
      stream.resume()

      function onceData (data) {
        stream.pause()
        stream.removeListener('end', onceEnd)
        stream.removeListener('error', onceError)
        resolve(data)
      }

      function onceEnd (data) {
        stream.removeListener('data', onceData)
        stream.removeListener('error', onceError)
        resolve(null)
      }

      function onceError (e) {
        stream.removeListener('data', onceData)
        stream.removeListener('end', onceEnd)
        reject(e)
      }
    })
  }

  _read2 (size) {
    const stream = this.stream
    return new Promise((resolve, reject) => {
      if (!stream.readable) {
        return resolve(null)
      }

      stream.on('readable', onReadable)
      stream.once('end', onceEnd)
      stream.once('error', onceError)

      function onReadable () {
        let chunk = stream.read(size)
        if (chunk) {
          stream.removeListener('readable', onReadable)
          stream.removeListener('error', onceError)
          stream.removeListener('end', onceEnd)
          resolve(chunk)
        }
      }

      function onceEnd (data) {
        stream.removeListener('readable', onReadable)
        stream.removeListener('error', onceError)
        resolve(null)
      }

      function onceError (e) {
        stream.removeListener('readable', onReadable)
        stream.removeListener('end', onceEnd)
        reject(e)
      }

      onReadable()
    })
  }

  readAll () {
    const stream = this.stream
    const bufferArray = []
    return new Promise((resolve, reject) => {
      stream.on('data', onData)
      stream.once('end', onEnd)
      stream.once('error', onError)

      function onData (data) {
        bufferArray.push(data)
      }

      function onEnd (data) {
        stream.removeListener('data', onData)
        stream.removeListener('error', onError)
        resolve(Buffer.concat(bufferArray))
      }

      function onError (e) {
        stream.removeListener('data', onData)
        stream.removeListener('end', onEnd)
        reject(e)
      }
    })
  }

  end () {
    const stream = this.stream
    return new Promise((resolve, reject) => {
      stream.once('end', onEnd)
      stream.once('error', onError)

      function onEnd (data) {
        stream.removeListener('error', onError)
        resolve(null)
      }

      function onError (e) {
        stream.removeListener('end', onEnd)
        reject(e)
      }
    })
  }
}

module.exports = PromiseReadable
