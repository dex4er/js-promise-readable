'use strict'

/* global Feature, Scenario, Given, When, Then */
const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

Feature('Test promise-readable module', () => {
  const PromiseReadable = require('../lib/promise-readable')
  const EventEmitter = require('events')

  Scenario('Read chunks from stream', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk1'))
    })

    Then('promise returns chunk', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk1'))
    })

    When('I call read method again', () => {
      this.promise = this.promiseReadable.read()
    })

    When('another data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk2'))
    })

    Then('promise returns another chunk', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk2'))
    })
  })

  Scenario('Read empty stream', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('close event is emitted', () => {
      this.readable.emit('close')
    })

    Then('promise returns null value', () => {
      return this.promise.should.eventually.to.be.null
    })
  })

  Scenario('Read stream with error', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call read method', () => {
      this.promise = this.promiseReadable.read()
    })

    When('error event is emitted', () => {
      this.readable.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Read all from stream', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call readAll method', () => {
      this.promise = this.promiseReadable.readAll()
    })

    When('data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk1'))
    })

    When('another data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk2'))
    })

    When('close event is emitted', () => {
      this.readable.emit('close')
    })

    Then('promise returns all chunks in one buffer', () => {
      return this.promise.should.eventually.deep.equal(new Buffer('chunk1chunk2'))
    })
  })

  Scenario('Read all from stream with error', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call readAll method', () => {
      this.promise = this.promiseReadable.readAll()
    })

    When('data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk1'))
    })

    When('error event is emitted', () => {
      this.readable.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })

  Scenario('Wait for end from stream', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call end method', () => {
      this.promise = this.promiseReadable.end()
    })

    When('data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk1'))
    })

    When('another data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk2'))
    })

    When('close event is emitted', () => {
      this.readable.emit('close')
    })

    Then('promise returns no result', () => {
      return this.promise.should.eventually.be.null
    })
  })

  Scenario('Wait for end from stream with error', function () {
    Given('Readable object', () => {
      this.readable = new EventEmitter()
    })

    Given('PromiseReadable object', () => {
      this.promiseReadable = new PromiseReadable(this.readable)
    })

    When('I call end method', () => {
      this.promise = this.promiseReadable.end()
    })

    When('data event is emitted', () => {
      this.readable.emit('data', new Buffer('chunk1'))
    })

    When('error event is emitted', () => {
      this.readable.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return this.promise.should.be.rejectedWith(Error, 'boom')
    })
  })
})
