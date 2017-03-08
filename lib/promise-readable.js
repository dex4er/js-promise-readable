'use strict'

const Promise = require('any-promise')

class PromiseReadable {
  constructor (stream) {
    this.stream = stream
  }

  read () {
    const stream = this.stream
    return new Promise((resolve, reject) => {
      stream.once('data', onData)
      stream.once('end', onEnd)
      stream.once('error', onError)
      stream.resume()

      function onData (data) {
        stream.pause()
        stream.removeListener('end', onEnd)
        stream.removeListener('error', onError)
        resolve(data)
      }

      function onEnd (data) {
        stream.removeListener('data', onData)
        stream.removeListener('error', onError)
        resolve(null)
      }

      function onError (e) {
        stream.removeListener('data', onData)
        stream.removeListener('end', onEnd)
        reject(e)
      }
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
