'use strict'

const Promise = require('any-promise')

class PromiseReadable {
  constructor (stream) {
    this.stream = stream
    this._ended = false
  }

  read (size) {
    return typeof this.stream.read === 'function' ? this._read2(size) : this._read1()
  }

  _read1 () {
    const stream = this.stream

    return new Promise((resolve, reject) => {
      if (this._ended || !stream.readable) {
        return resolve(null)
      }

      const onceData = chunk => {
        stream.pause()
        stream.removeListener('end', onceEnd)
        stream.removeListener('error', onceError)
        resolve(chunk)
      }

      const onceEnd = () => {
        stream.removeListener('data', onceData)
        stream.removeListener('error', onceError)
        this._ended = true
        resolve(null)
      }

      const onceError = e => {
        stream.removeListener('data', onceData)
        stream.removeListener('end', onceEnd)
        reject(e)
      }

      stream.once('data', onceData)
      stream.once('end', onceEnd)
      stream.once('error', onceError)
      stream.resume()
    })
  }

  _read2 (size) {
    const stream = this.stream
    return new Promise((resolve, reject) => {
      if (this._ended || !stream.readable) {
        return resolve(null)
      }

      const onReadable = () => {
        let chunk = stream.read(size)
        if (chunk) {
          stream.removeListener('readable', onReadable)
          stream.removeListener('error', onceError)
          stream.removeListener('end', onceEnd)
          resolve(chunk)
        }
      }

      const onceEnd = () => {
        stream.removeListener('readable', onReadable)
        stream.removeListener('error', onceError)
        this._ended = true
        resolve(null)
      }

      const onceError = e => {
        stream.removeListener('readable', onReadable)
        stream.removeListener('end', onceEnd)
        reject(e)
      }

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
      if (this._ended) {
        return resolve(null)
      }

      stream.on('data', onData)
      stream.once('end', onEnd)
      stream.once('error', onError)

      function onData (data) {
        bufferArray.push(data)
      }

      function onEnd (data) {
        stream.removeListener('data', onData)
        stream.removeListener('error', onError)
        this._ended = true
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
      if (this._ended) {
        return resolve(null)
      }

      stream.once('end', onceEnd)
      stream.once('error', onceError)

      function onceEnd (data) {
        stream.removeListener('error', onceError)
        this._ended = true
        resolve(null)
      }

      function onceError (e) {
        stream.removeListener('end', onceEnd)
        reject(e)
      }
    })
  }
}

module.exports = PromiseReadable
