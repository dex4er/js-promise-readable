import {expect} from 'chai'

import {And, Feature, Given, Scenario, Then, When} from './lib/steps'

import {MockStreamReadable} from './lib/mock-stream-readable'

import {PromiseReadable} from '../src/promise-readable'

Feature('Test promise-readable module for readAll method', () => {
  Scenario('Read all from stream', () => {
    let content: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given('Readable object', () => {
      stream = new MockStreamReadable()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I call readAll method', () => {
      promiseReadable.readAll().then(argument => {
        content = argument
      })
    })

    And('"data" event is emitted', () => {
      if (!stream.paused) {
        stream.emit('data', Buffer.from('chunk1'))
      }
    })

    And('another "data" event is emitted', () => {
      if (!stream.paused) {
        stream.emit('data', Buffer.from('chunk2'))
      }
    })

    And('"close" event is emitted', () => {
      stream.emit('end')
    })

    Then('promise returns all chunks in one buffer', () => {
      return expect(content).to.deep.equal(Buffer.from('chunk1chunk2'))
    })
  })

  Scenario('Read all from paused stream', () => {
    let content: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given('Readable object', () => {
      stream = new MockStreamReadable()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I pause stream', () => {
      stream.pause()
    })

    And('I call readAll method', () => {
      promiseReadable.readAll().then(argument => {
        content = argument
      })
    })

    And('"data" event is emitted', () => {
      if (!stream.paused) {
        stream.emit('data', Buffer.from('chunk1'))
      }
    })

    And('another "data" event is emitted', () => {
      if (!stream.paused) {
        stream.emit('data', Buffer.from('chunk2'))
      }
    })

    And('"close" event is emitted', () => {
      stream.emit('end')
    })

    Then('promise returns all chunks in one buffer', () => {
      return expect(content).to.deep.equal(Buffer.from('chunk1chunk2'))
    })
  })

  Scenario('Read all from closed stream', () => {
    let content: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given('Readable object', () => {
      stream = new MockStreamReadable()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream is closed', () => {
      stream.close()
    })

    And('I call readAll method', async () => {
      content = await promiseReadable.readAll()
    })

    Then('promise returns undefined value', () => {
      return expect(content).to.be.undefined
    })
  })

  Scenario('Read all from destroyed stream', () => {
    let content: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given('Readable object', () => {
      stream = new MockStreamReadable()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream is destroyed', () => {
      stream.destroy()
    })

    And('I call readAll method', async () => {
      content = await promiseReadable.readAll()
    })

    Then('promise returns undefined value', () => {
      return expect(content).to.be.undefined
    })
  })

  Scenario('Read all from stream with error', () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given('Readable object', () => {
      stream = new MockStreamReadable()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I call readAll method', () => {
      promiseReadable.readAll().catch(err => {
        error = err
      })
    })

    And('"data" event is emitted', () => {
      stream.emit('data', Buffer.from('chunk1'))
    })

    And('"error" event is emitted', () => {
      stream.emit('error', new Error('boom'))
    })

    Then('promise is rejected', () => {
      return expect(error)
        .to.be.an('error')
        .with.property('message', 'boom')
    })
  })

  Scenario('Read all from stream with emitted error', () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given('Readable object', () => {
      stream = new MockStreamReadable()
    })

    And('PromiseReadable object', () => {
      promiseReadable = new PromiseReadable(stream)
    })

    And('"error" event is emitted', () => {
      stream.emit('error', new Error('boom'))
    })

    When('I call readAll method', () => {
      promiseReadable.readAll().catch(err => {
        error = err
      })
    })

    And('"data" event is emitted', () => {
      stream.emit('data', Buffer.from('chunk1'))
    })

    Then('promise is rejected', () => {
      return expect(error)
        .to.be.an('error')
        .with.property('message', 'boom')
    })
  })
})
