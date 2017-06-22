'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

Feature('Test promise-readable module with stream2 API', () => {
  const PromiseReadable = require('../lib/promise-readable')
  const EventEmitter = require('events')

  class MockStream extends EventEmitter {
    constructor () {
      super()
      this.readable = true
      this._buffer = Buffer.alloc(0)
      this._ended = false
    }
    read (size) {
      size = size || 1024
      if (this._error) {
        this.emit('error', this._error)
        return null
      }
      if (this._buffer.length === 0) {
        if (!this._ended) {
          this._ended = true
          this.emit('end')
        }
        return null
      }
      const chunk = this._buffer.slice(0, size)
      this._buffer = this._buffer.slice(size)
      return chunk
    }
    _append (chunk) {
      this._buffer = Buffer.concat([this._buffer, chunk])
    }
    _throw (e) {
      this._error = e
    }
  }

  Scenario('Read chunks from stream', () => {
    let promise
    let promiseReadable
    let stream

    Given('Readable object', () => {
      stream = new MockStream()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream contains some data', () => {
      stream._append(Buffer.from('chunk1'))
    })

    And('I call read method', () => {
      promise = promiseReadable.read()
    })

    Then('promise returns chunk', () => {
      return promise.should.eventually.deep.equal(Buffer.from('chunk1'))
    })

    When('stream contains some another data', () => {
      stream._append(Buffer.from('chunk2'))
    })

    And('I call read method again', () => {
      promise = promiseReadable.read()
    })

    Then('promise returns another chunk', () => {
      return promise.should.eventually.deep.equal(Buffer.from('chunk2'))
    })
  })

  Scenario('Read empty stream', () => {
    let promise
    let promiseReadable
    let stream

    Given('Readable object', () => {
      stream = new MockStream()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I call read method', () => {
      promise = promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return promise.should.eventually.to.be.null
    })
  })

  Scenario('Read ended stream', () => {
    let promise
    let promiseReadable
    let stream

    Given('Readable object', () => {
      stream = new MockStream()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I call read method', () => {
      return promiseReadable.read()
    })

    And('I call read method again', () => {
      promise = promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return promise.should.eventually.to.be.null
    })
  })

  Scenario('Read stream with error', () => {
    let promise
    let promiseReadable
    let stream

    Given('Readable object', () => {
      stream = new MockStream()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream will emit an error event', () => {
      stream._throw(new Error('boom'))
    })

    And('I call read method', () => {
      promise = promiseReadable.read()
    })

    Then('promise is rejected', () => {
      return promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Read non-Readable stream', () => {
    let promise
    let promiseReadable
    let stream

    Given('Non-Readable object', () => {
      stream = new MockStream()
      stream.readable = false
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream contains some data', () => {
      stream._append(Buffer.from('chunk1'))
    })

    And('I call read method', () => {
      promise = promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return promise.should.eventually.to.be.null
    })
  })
})
