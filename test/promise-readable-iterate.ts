import chai, {expect} from "chai"

import dirtyChai from "dirty-chai"
chai.use(dirtyChai)

import {PromiseReadable} from "../src/promise-readable"

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import {MockStreamReadable} from "./lib/mock-stream-readable"

Feature("Test promise-readable module for iterate method", () => {
  Scenario("Read chunks from stream", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let result: IteratorResult<string | Buffer>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream contains some data", () => {
      stream.append(Buffer.from("chunk1"))
    })

    And("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      result = await iterator.next()
    })

    Then("iterator is not done", () => {
      expect(result.done).to.be.false()
    })

    And("iterator returns chunk", () => {
      expect(result.value).to.deep.equal(Buffer.from("chunk1"))
    })

    When("stream contains some another data", () => {
      stream.append(Buffer.from("chunk2"))
    })

    And("I get next result from iterator again", async () => {
      result = await iterator.next()
    })

    Then("iterator is not done", () => {
      expect(result.done).to.be.false()
    })

    And("iterator returns another chunk", () => {
      expect(result.value).to.deep.equal(Buffer.from("chunk2"))
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })
  })

  Scenario("Read chunks from stream with encoding", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let result: IteratorResult<string | Buffer>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream contains some data", () => {
      stream.append(Buffer.from("chunk1"))
    })

    And("I set encoding", () => {
      promiseReadable.setEncoding("utf8")
    })

    And("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      result = await iterator.next()
    })

    Then("iterator is not done", () => {
      expect(result.done).to.be.false()
    })

    And("iterator returns chunk", () => {
      expect(result.value).to.deep.equal("chunk1")
    })

    When("stream contains some another data", () => {
      stream.append(Buffer.from("chunk2"))
    })

    And("I get next result from iterator again", async () => {
      result = await iterator.next()
    })

    Then("iterator is not done", () => {
      expect(result.done).to.be.false()
    })

    And("iterator returns another chunk", () => {
      expect(result.value).to.deep.equal("chunk2")
    })
  })

  Scenario("Read empty stream", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let result: IteratorResult<string | Buffer>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      result = await iterator.next()
    })

    Then("iterator is done", () => {
      expect(result.done).to.be.true()
    })
  })

  Scenario("Read closed stream", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let result: IteratorResult<string | Buffer>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream is closed", () => stream.close())

    And("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      result = await iterator.next()
    })

    Then("iterator is done", () => {
      expect(result.done).to.be.true()
    })
  })

  Scenario("Read destroyed stream", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let result: IteratorResult<string | Buffer>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream is destroyed", () => {
      stream.destroy()
    })

    And("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      result = await iterator.next()
    })

    Then("iterator is done", () => {
      expect(result.done).to.be.true()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })
  })

  Scenario("Read stream with error", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream will emit an error" event', () => {
      stream.setError(new Error("boom"))
    })

    And("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      try {
        await iterator.next()
      } catch (e) {
        error = e
      }
    })

    Then("iterator is rejected", () => {
      expect(error).to.be.an("error").with.property("message", "boom")
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })
  })

  Scenario("Read stream with emitted error", () => {
    let iterator: AsyncIterableIterator<Buffer | string>
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream emitted an error" event', () => {
      stream.emit("error", new Error("boom"))
    })

    And("I get an iterator", () => {
      iterator = promiseReadable.iterate()
    })

    And("I get next result from iterator", async () => {
      try {
        await iterator.next()
      } catch (e) {
        error = e
      }
    })

    Then("iterator is rejected", () => {
      expect(error).to.be.an("error").with.property("message", "boom")
    })
  })
})
