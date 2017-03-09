'use strict'

/* global Feature, Scenario, Given, When, Then */
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
      this._buffer = new Buffer(0)
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

  Scenario('Read chunks from stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('stream contains some data', () => {
      this.stream._append(new Buffer('chunk1'))
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise returns chunk', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk1'))
    })

    When('stream contains some another data', () => {
      this.stream._append(new Buffer('chunk2'))
    })

    When('I call read method again', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise returns another chunk', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk2'))
    })
  })

  Scenario('Read empty stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Read ended stream', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('I call read method', () => {
      return this.promiseReadable.read()
    })

    When('I call read method again', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Read stream with error', function () {
    Given('Readable object', () => {
      this.stream = new MockStream()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('stream will emit an error event', () => {
      this.stream._throw(new Error('boom'))
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Read non-Readable stream', function () {
    Given('Non-Readable object', () => {
      this.stream = new MockStream()
      this.stream.readable = false
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.stream)
    })

    When('stream contains some data', () => {
      this.stream._append(new Buffer('chunk1'))
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })
})
