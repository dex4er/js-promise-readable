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
      stream.once('close', onClose)
      stream.once('error', onError)

      function onData (data) {
        stream.removeListener('close', onClose)
        stream.removeListener('error', onError)
        resolve(data)
      }

      function onClose (data) {
        stream.removeListener('data', onData)
        stream.removeListener('error', onError)
        resolve(null)
      }

      function onError (e) {
        stream.removeListener('data', onData)
        stream.removeListener('close', onClose)
        reject(e)
      }
    })
  }

  readAll () {
    const stream = this.stream
    const bufferArray = []
    return new Promise((resolve, reject) => {
      stream.on('data', onData)
      stream.once('close', onClose)
      stream.once('error', onError)

      function onData (data) {
        bufferArray.push(data)
      }

      function onClose (data) {
        stream.removeListener('data', onData)
        stream.removeListener('error', onError)
        resolve(Buffer.concat(bufferArray))
      }

      function onError (e) {
        stream.removeListener('data', onData)
        stream.removeListener('close', onClose)
        reject(e)
      }
    })
  }

  end () {
    const stream = this.stream
    return new Promise((resolve, reject) => {
      stream.once('close', onClose)
      stream.once('error', onError)

      function onClose (data) {
        stream.removeListener('error', onError)
        resolve(null)
      }

      function onError (e) {
        stream.removeListener('close', onClose)
        reject(e)
      }
    })
  }
}

module.exports = PromiseReadable
